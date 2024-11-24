//associationControllers.js
const admin = require("../config/firebase");
const path = require('path');

// for signup
const signupAssociation = async (req, res) => {
  const { associationName, associationrecruiterName, associationEmail, recruiterMobilePhone, password, listMembers, events, profile } = req.body;

  try {
    // Create a new user with email and password
    const user = await admin.auth().createUser({
      email: `${associationEmail}`,
      password: `${password}`,
    });

    // Store additional data in the Firestore
    const firestore = admin.firestore();
    const currentDate = admin.firestore.Timestamp.now();
    await firestore.collection("Associations").doc(user.uid).set({
      associationName,
      associationrecruiterName,
      associationEmail,
      recruiterMobilePhone,
      role: "association",
      listMembers: [],
      profile: [],
      WaitingListMembers: [],
      currentDate,
    });
    res.status(201).json({ message: "association registered successfully.", uid: user.uid });

  } catch (error) {
    console.error("Error registering association.", error);
    res.status(500).json({ message: "Failed to register association.", error });
  }
};
// for the api
const getAssociationsData = async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, '../api/associationsData.json'));
  } catch (error) {
    console.error('Error sending associations data file:', error);
    res.status(500).json({ message: 'Error sending associations data file' });
  }
};

// for profile
const getAssociationById = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await admin.firestore().collection("Associations").doc(id).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Association not found' });
    } else {
      res.status(200).json(doc.data());
    }
  } catch (error) {
    console.error('Error fetching association:', error);
    res.status(500).json({ message: 'Failed to fetch association.' });
  }
};

//for join to association in her profile
const joinAssociation = async (req, res) => {
  const { id } = req.params;  // id of the association
  const { uid, firstname, lastname, mobilePhone, email } = req.body;  // details of the volunteer

  if (!id || !uid || !firstname || !lastname || !mobilePhone || !email) {
    return res.status(400).json({ message: 'Missing association or volunteer ID' });
  }

  try {
    const associationRef = admin.firestore().collection("Associations").doc(id);
    const associationDoc = await associationRef.get();

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    // Add the volunteer's details to the WaitingListMembers array
    await associationRef.update({
      WaitingListMembers: admin.firestore.FieldValue.arrayUnion({
        uid, //maybe not need
        firstname,
        lastname,
        mobilePhone,
        email
      }),
    });

    res.status(200).json({ message: 'Volunteer added to the waiting list' });
  } catch (error) {
    console.error('Error adding volunteer to waiting list:', error);
    res.status(500).json({ message: 'Failed to add volunteer to waiting list' });
  }
};

// for mange page
const getAssociation = async (req, res) => {
  const { id } = req.params;

  try {
    const associationsRef = admin.firestore().collection("Associations");
    const associationDoc = await associationsRef.doc(id).get();

    if (!associationDoc.exists) {
      res.status(404).json({ message: `Association with id ${id} not found` });
      return;
    }

    const association = associationDoc.data();
    res.status(200).json(association);
  } catch (error) {
    console.error('Error fetching association:', error);
    res.status(500).json({ message: 'Failed to fetch association.' });
  }
};


//for approve volunteer
const approveVolunteer = async (req, res) => {
  const associationId = req.params.id;
  const { volunteerId } = req.body;

  console.log(`Approving volunteer ${volunteerId} for association ${associationId}`); // added logging

  try {
    const associationRef = admin.firestore().collection('Associations').doc(associationId);
    const associationDoc = await associationRef.get();

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    const associationData = associationDoc.data();
    const updatedWaitingList = associationData.WaitingListMembers.filter(volunteer => volunteer.uid !== volunteerId);
    const approvedVolunteers = associationData.WaitingListMembers.filter(volunteer => volunteer.uid === volunteerId);
    const updatedMembersList = [...associationData.listMembers, ...approvedVolunteers];

    console.log(`Approved volunteers: ${JSON.stringify(approvedVolunteers)}`); // added logging

    await associationRef.update({
      WaitingListMembers: updatedWaitingList,
      listMembers: updatedMembersList
    });

    // Get volunteer document reference
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);

    // Add new association to the volunteer's list
    const newAssociation = {
      uid: associationId,
      associationName: associationData.associationName,
      associationrecruiterName: associationData.associationrecruiterName,
      recruiterMobilePhone: associationData.recruiterMobilePhone,
      associationEmail: associationData.associationEmail,
    };

    // Update volunteer's list of associations in Firestore using arrayUnion
    await volunteerRef.update({
      listAssociations: admin.firestore.FieldValue.arrayUnion(newAssociation)
    });

    res.status(200).json({ message: 'Volunteer approved successfully.' });
  } catch (error) {
    console.error(`Error approving volunteer: ${error}`); // improved error logging
    res.status(500).json({ message: 'Error approving volunteer.', error });
  }
};


//for reject volunteer
const rejectVolunteer = async (req, res) => {
  const associationId = req.params.id;
  const { volunteerId } = req.body;

  try {
    const associationRef = admin.firestore().collection('Associations').doc(associationId);
    const associationDoc = await associationRef.get();

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    const associationData = associationDoc.data();
    const updatedWaitingList = associationData.WaitingListMembers.filter(volunteer => volunteer.uid !== volunteerId);

    await associationRef.update({
      WaitingListMembers: updatedWaitingList
    });

    res.status(200).json({ message: 'Volunteer rejected successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting volunteer.', error });
  }
};

const addCommentToAssociation = async (req, res) => {
  const { id } = req.params;  // id of the association
  const { senderName, comment } = req.body;  // details of the comment

  const timestamp = admin.firestore.Timestamp.now();

  const newComment = {
    Name: senderName,
    comment: comment,
    timestamp: timestamp,
  }
  try {
    const associationRef = admin.firestore().collection("Associations").doc(id);

    // Add the comment to the commend array
    await associationRef.update({
      comment: admin.firestore.FieldValue.arrayUnion(newComment),
    });

    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment' });
  }
};

const getAssociationComments = async (req, res) => {
  const { id } = req.params;  // id of the association

  try {
    const associationRef = admin.firestore().collection("Associations").doc(id);
    const associationDoc = await associationRef.get();

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    const associationData = associationDoc.data();

    // Return the comments array
    res.status(200).json(associationData.comment);
  } catch (error) {
    console.error('Error getting comments:', error);
    res.status(500).json({ message: 'Failed to get comments' });
  }
};

const deleteVolunteer = async (req, res) => {
  const associationId = req.params.id;
  const { volunteerId } = req.body;

  try {
    // Document references
    const volunteerRef = admin.firestore().collection('Volunteers').doc(volunteerId);
    const associationRef = admin.firestore().collection('Associations').doc(associationId);

    const associationDoc = await associationRef.get();
    const volunteerDoc = await volunteerRef.get();

    if (!associationDoc.exists || !volunteerDoc.exists) {
      return res.status(404).json({ message: 'Volunteer or association not found' });
    }

    const associationData = associationDoc.data();
    const volunteerData = volunteerDoc.data();

    const updatedListMembers = associationData.listMembers.filter(member => member.uid !== volunteerId);
    const updatedListAssociations = volunteerData.listAssociations.filter(association => association.uid !== associationId);

    // Remove the association from the volunteer's listAssociations
    await volunteerRef.update({
      listAssociations: updatedListAssociations
    });

    // Remove the volunteer from the association's listMembers
    await associationRef.update({
      listMembers: updatedListMembers
    });

    res.status(200).json({ message: 'Volunteer deleted successfully.' });
  } catch (error) {
    console.error('Error deleting volunteer:', error);
    res.status(500).json({ message: 'Failed to delete volunteer.' });
  }
};


const updateProfile = async (req, res) => {
  const { id } = req.params;
  const { branchAreas, fieldOfActivity, associationGoals, desiredVolunteers, volunteerRestrictions } = req.body;

  const profileData = {
    branchAreas,
    fieldOfActivity,
    associationGoals,
    desiredVolunteers,
    volunteerRestrictions,
  };

  try {
    const associationRef = admin.firestore().collection("Associations").doc(id);
    const associationDoc = await associationRef.get();

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    // Update the association profile
    await associationRef.update({
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
    const associationRef = admin.firestore().collection("Associations").doc(id);
    const associationDoc = await associationRef.get();

    if (!associationDoc.exists) {
      return res.status(404).json({ message: 'Association not found' });
    }

    const associationData = associationDoc.data().profile;
    return res.status(200).json(associationData);
  } catch (error) {
    console.error('Error getting profile:', error);
    return res.status(500).json({ message: 'An error occurred while getting the profile', error });
  }
};



module.exports = { getProfile, updateProfile, deleteVolunteer, signupAssociation, getAssociationsData, getAssociationById, joinAssociation, getAssociation, approveVolunteer, rejectVolunteer, addCommentToAssociation, getAssociationComments };