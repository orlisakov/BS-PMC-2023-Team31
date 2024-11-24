//volunteerController.js
const admin = require("../config/firebase");

const signupVolunteer = async (req, res) => {
  const { firstname, lastname, email, mobilePhone, password } = req.body;

  try {
    // Create a new user with email and password
    const user = await admin.auth().createUser({
      email,
      password,
    });

    // Store additional data in the Firestore
    const firestore = admin.firestore();
    const currentDate = admin.firestore.Timestamp.now();
    await firestore.collection("Volunteers").doc(user.uid).set({
      firstname,
      lastname,
      email,
      mobilePhone,
      role: "volunteer",
      events: [],
      listAssociations: [],
      profile: [],
      currentDate,
      whishlist: [],
    });

    res.status(201).json({ message: "Volunteer registered successfully.", uid: user.uid });
  } catch (error) {
    console.error("Error registering volunteer.", error);
    res.status(500).json({ message: "Failed to register volunteer.", error });
  }
};

const getVolunteerById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await admin.firestore().collection("Volunteers").doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Volunteer not found' });
    } else {
      console.log(doc.data()); // Add this line
      res.status(200).json(doc.data());
    }
  } catch (error) {
    console.error('Error fetching association:', error);
    res.status(500).json({ message: 'Failed to fetch Volunteer.' });
  }
}

const deleteAssociation = async (req, res) => {
  const volunteerId = req.params.id;
  const { associationId } = req.body;

  try {
    // Document references
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);
    const associationRef = admin.firestore().collection('Associations').doc(associationId);

    const associationDoc = await associationRef.get();
    const volunteerDoc = await volunteerRef.get();

    if (!associationDoc.exists || !volunteerDoc.exists) {
      return res.status(404).json({ message: 'Association or volunteer not found' });
    }

    const associationData = associationDoc.data();
    const volunteerData = volunteerDoc.data();

    const updatedListAssociations = volunteerData.listAssociations.filter(association => association.uid !== associationId);
    const updatedListMembers = associationData.listMembers.filter(volunteer => volunteer.uid !== volunteerId);

    // Remove the association from the volunteer's listAssociations
    await volunteerRef.update({
      listAssociations: updatedListAssociations
    });

    // Remove the volunteer from the association's listMembers
    await associationRef.update({
      listMembers: updatedListMembers
    });

    res.status(200).json({ message: 'Association deleted successfully.' });
  } catch (error) {
    console.error('Error deleting association:', error);
    res.status(500).json({ message: 'Failed to delete association.' });
  }
};

const deleteEvent = async (req, res) => {
  const { volunteerId, eventId } = req.params;

  try {
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);
    const eventRef = admin.firestore().collection('Events').doc(eventId);

    const volunteerDoc = await volunteerRef.get();
    const eventDoc = await eventRef.get();

    if (!volunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    if (!eventDoc.exists) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const volunteerData = volunteerDoc.data();
    const eventData = eventDoc.data();

    // updatedEvents will contain all events except the one with the specified eventId
    const updatedEvents = volunteerData.events.filter(event => event.id !== eventId);

    // Update the volunteer's events array in Firestore
    await volunteerRef.update({
      events: updatedEvents
    });

    // updatedVolunteers will contain all volunteers except the one with the specified volunteerId
    const updatedVolunteers = eventData.volunteers.filter(volunteer => volunteer.id !== volunteerId);

    // Update the event's volunteers array in Firestore
    await eventRef.update({
      volunteers: updatedVolunteers
    });

    res.status(200).json({ message: 'Event deleted successfully.' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Failed to delete event.' });
  }
};


const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { age, livingArea, isMobile, volunteeredBefore, interests, skills, workedInOrg } = req.body;

  const profileData = {
    age,
    livingArea,
    isMobile,
    volunteeredBefore,
    interests,
    skills,
    workedInOrg,
  };

  try {
    const VolunteerRef = admin.firestore().collection("Volunteers").doc(id);
    const VolunteerDoc = await VolunteerRef.get();

    if (!VolunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }


    await VolunteerRef.update({
      profile: profileData
    });

    return res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    return res.status(500).json({ message: 'An error occurred while updating the profile', error });
  }
};


const getProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const VolunteerRef = admin.firestore().collection("Volunteers").doc(id);
    const VolunteerDoc = await VolunteerRef.get();

    if (!VolunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const volunteerData = VolunteerDoc.data();

    return res.status(200).json(volunteerData);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the profile', error });
  }
};


const addToWishlist = async (req, res) => {
  const { volunteerId, associationId } = req.params;

  try {
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);
    const associationRef = admin.firestore().collection('Associations').doc(associationId);

    const volunteerDoc = await volunteerRef.get();
    const associationDoc = await associationRef.get();

    if (!volunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    const volunteerData = volunteerDoc.data();
    const associationData = associationDoc.data();

    // Check if the association is already in the wishlist
    if (volunteerData.whishlist.some(association => association.id === associationId)) {
      return res.status(400).json({ message: 'Association already in wishlist' });
    }

    // Updated wishlist with required association fields
    const updatedWishlist = [...volunteerData.whishlist,
    {
      id: associationId,
      associationName: associationData.associationName,
      associationrecruiterName: associationData.associationrecruiterName,
      associationEmail: associationData.associationEmail
    }];

    // Update the volunteer's whishlist array in Firestore
    await volunteerRef.update({
      whishlist: updatedWishlist
    });

    res.status(200).json({ message: 'Association added to wishlist successfully.' });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ message: 'Failed to add association to wishlist.' });
  }
};

const getWishlist = async (req, res) => {
  const { id } = req.params;

  try {
    const VolunteerRef = admin.firestore().collection("Volunteers").doc(id);
    const VolunteerDoc = await VolunteerRef.get();

    if (!VolunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const volunteerData = VolunteerDoc.data();
    const wishlist = volunteerData.whishlist;

    return res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return res.status(500).json({ message: 'An error occurred while fetching the wishlist', error });
  }
};

const removeFromWishlist = async (req, res) => {
  const { volunteerId, associationId } = req.params;

  try {
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);

    const volunteerDoc = await volunteerRef.get();

    if (!volunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }

    const volunteerData = volunteerDoc.data();

    // Check if the association exists in the wishlist
    const associationIndex = volunteerData.whishlist.findIndex(association => association.id === associationId);
    if (associationIndex === -1) {
      return res.status(400).json({ message: 'Association not found in wishlist' });
    }

    // Remove the association from the wishlist
    volunteerData.whishlist.splice(associationIndex, 1);

    // Update the volunteer's wishlist array in Firestore
    await volunteerRef.update({
      whishlist: volunteerData.whishlist
    });

    res.status(200).json({ message: 'Association removed from wishlist successfully.' });
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    res.status(500).json({ message: 'Failed to remove association from wishlist.' });
  }
};

module.exports = { removeFromWishlist, getWishlist, addToWishlist, getProfile, signupVolunteer, getVolunteerById, deleteAssociation, deleteEvent, updateProfile };
