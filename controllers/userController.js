const admin = require("../config/firebase");
const fs = require('fs').promises;
const path = require('path');

const loginUser = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Get the user's document from Firestore
    const firestore = admin.firestore();

    // Define the collections to search for the user
    const collections = ["Volunteers", "Associations", "Admin"];
    let userDoc = null;
    for (const collection of collections) {
      const doc = await firestore.collection(collection).doc(uid).get();

      if (doc.exists) {
        userDoc = doc.data();
        break;
      }
    }
    if (!userDoc) {
      res.status(404).json({ message: "User document not found.", uid });
      return;
    }

    // Merge the role, token, uid, and other user data into a single object
    const responseData = {
      message: "Logged in successfully",
      token: idToken,
      id: uid,
      ...userDoc
    };

    res.status(200).json(responseData);

  } catch (error) {
    console.error("Error logging.", error);
    res.status(500).json({ message: "Failed to log.", error });
  }
};

const deleteAssociationTest = async (req, res) => {
  
  try {
    const userRecord = await admin.auth().getUserByEmail("example@email.com");
    const associationId = userRecord.uid;
    console.log(`Deleting association ${associationId}`)
    const associationRef = admin.firestore().collection('Associations').doc(associationId);
    
    await admin.auth().deleteUser(associationId);
    await associationRef.delete();
    

    return res.status(200).json({ message: 'Association deleted successfully' });
  } catch (error) {
    console.error('Error deleting association:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the association', error });
  }
};


const deleteEventsTest = async (req, res) => {
  const db = admin.firestore();

  try {
    const eventRef = db.collection('Events');
    const snapshot = await eventRef.where('associationName', '==', "עמותה לדוגמא").get();
    
    // create a batch
    const batch = db.batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    // commit the batch
    await batch.commit();

    res.status(200).send({ status: 'success', message: 'Events successfully deleted.' });

  } catch (error) {
    res.status(500).send(error);
  }
};

const deleteVolunteerTest = async (req, res) => {
  try {
    const userEmail = "exemple1@gmail.com";

    // Getting the volunteer
    const userRecord = await admin.auth().getUserByEmail(userEmail);
    const volunteerId = userRecord.uid;
    console.log(`Deleting volunteer ${volunteerId}`)

    // Define the volunteers collection and associations collection
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);
    const associationsCollection = admin.firestore().collection('Associations');

    // Get all associations
    const associationsSnapshot = await associationsCollection.get();

    // Loop over associations and remove the volunteer from each
    for (let doc of associationsSnapshot.docs) {
      const association = doc.data();

      // Find the volunteer object in the WaitingListMembers array
      const waitingListMembers = association.WaitingListMembers || [];
      const volunteerIndex = waitingListMembers.findIndex(member => member.email === userEmail);

      if (volunteerIndex !== -1) {
        // Volunteer found in the array, remove the volunteer
        waitingListMembers.splice(volunteerIndex, 1);
        
        // Update the association in the Firestore
        await doc.ref.update({ WaitingListMembers: waitingListMembers });
      }
    }

    // Delete the volunteer from auth and the volunteers collection
    await admin.auth().deleteUser(volunteerId);
    await volunteerRef.delete();

    return res.status(200).json({ message: 'Volunteer deleted successfully' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    return res.status(500).json({ message: 'An error occurred while deleting the volunteer', error });
  }
};


module.exports = { deleteEventsTest, deleteAssociationTest, loginUser, deleteVolunteerTest };