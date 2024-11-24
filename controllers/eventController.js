//eventController.js
const admin = require("../config/firebase");


const AddEvent = async (req, res) => {
  const { eventTopic, associationName, eventDescription, eventStartDate, eventEndDate, amountOfVolunteers } = req.body;

  try {
    const firestore = admin.firestore();
    await firestore.collection("Events").doc().set({
      eventTopic,
      associationName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      amountOfVolunteers,
      volunteers: [],
    });

    res.status(201).json({ message: "Event registered successfully." });
  } catch (error) {
    console.error("Error registering Event.", error);
    res.status(500).json({ message: "Failed to register Event.", error });
  }
}

const getEventsforAsso = async (req, res) => {
  const { name } = req.body;

  try {
    const firestore = admin.firestore();
    const eventsRef = firestore.collection("Events");
    const snapshot = await eventsRef.where('associationName', '==', name).get();
    if (snapshot.empty) {
      res.status(404).json({ message: "No matching events." });
      return;
    }
    let events = [];
    snapshot.forEach(doc => {
      let data = doc.data();
      let id = doc.id;
      events.push({ id, ...data });
    });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error getting events.", error);
    res.status(500).json({ message: "Failed to get events.", error });
  }
}


const editEvent = async (req, res) => {
  const { id, eventTopic, associationName, eventDescription, eventStartDate, eventEndDate, amountOfVolunteers } = req.body;

  try {
    const firestore = admin.firestore();
    const eventRef = firestore.collection("Events").doc(id);

    await eventRef.update({
      eventTopic,
      associationName,
      eventDescription,
      eventStartDate,
      eventEndDate,
      amountOfVolunteers
    });

    res.status(200).json({ message: "Event updated successfully." });
  } catch (error) {
    console.error("Error updating event.", error);
    res.status(500).json({ message: "Failed to update event.", error });
  }
}

const deleteEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const firestore = admin.firestore();
    const eventRef = firestore.collection("Events").doc(id);

    // Delete the event
    await eventRef.delete();

    // Get all volunteers who have this event in their 'events' array
    const volunteers = await firestore.collection("Volunteers").get();

    // For each volunteer, remove the event from their 'events' array
    volunteers.forEach(async doc => {
      const volunteer = doc.data();

      // Check if the volunteer's events array contains the event to be deleted
      if (volunteer.events.some(event => event.id === id)) {
        // Filter out the event to be deleted
        const updatedEvents = volunteer.events.filter(event => event.id !== id);

        // Update the 'events' array for the volunteer
        await firestore.collection("Volunteers").doc(doc.id).update({
          events: updatedEvents
        });
      }
    });

    res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Error deleting event.", error);
    res.status(500).json({ message: "Failed to delete event.", error });
  }
}




const getEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const firestore = admin.firestore();
    const eventRef = firestore.collection("Events").doc(id);
    const doc = await eventRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: "Event not found." });
      return;
    }

    let data = doc.data();
    res.status(200).json({ id, ...data });
  } catch (error) {
    console.error("Error getting event.", error);
    res.status(500).json({ message: "Failed to get event.", error });
  }
};

const joinEvent = async (req, res) => {
  const { eventId, userId, volunteerFirstName, volunteerLastName, volunteerEmail, volunteerPhone } = req.body;

  try {
    const firestore = admin.firestore();
    const eventRef = firestore.collection("Events").doc(eventId);
    const userRef = firestore.collection("Volunteers").doc(userId);

    // Fetch user data
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const eventDoc = await eventRef.get();
    if (!eventDoc.exists) {
      res.status(404).json({ message: "Event not found." });
      return;
    }

    const eventData = eventDoc.data();

    // Check if volunteer is already part of the event
    if (eventData.volunteers.some(volunteer => volunteer.id === userId)) {
      res.status(409).json({ message: "Volunteer is already part of this event." });
      return;
    }

    // Append new volunteer
    const newVolunteer = {
      id: userId, // add user's id
      firstName: volunteerFirstName,
      lastName: volunteerLastName,
      email: volunteerEmail,
      mobilePhone: volunteerPhone,
    };

    // Update volunteers array in the event document
    await eventRef.update({
      volunteers: admin.firestore.FieldValue.arrayUnion(newVolunteer),
    });

    // Add event to the user's event list
    const newUserEvent = {
      id: eventId,
      topic: eventData.eventTopic,
      startDate: eventData.eventStartDate,
      endDate: eventData.eventEndDate,
    };

    // Update events array in the user document
    await userRef.update({
      events: admin.firestore.FieldValue.arrayUnion(newUserEvent),
    });

    res.status(200).json({ message: "Joined event successfully." });
  } catch (error) {
    console.error("Error joining event.", error);
    res.status(500).json({ message: "Failed to join event.", error });
  }
};




module.exports = { AddEvent, getEventsforAsso, deleteEvent, editEvent, getEvent, joinEvent }