const admin = require("../config/firebase");
const fs = require('fs').promises;
const path = require('path');

const getAllUsers = async (req, res) => {
  try {
    const volunteersSnapshot = await admin.firestore().collection("Volunteers").get();
    const associationsSnapshot = await admin.firestore().collection("Associations").get();
    const eventsSnapshot = await admin.firestore().collection("Events").get();
    const adminSnapshot = await admin.firestore().collection("Admin").get();

    const volunteers = volunteersSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    const associations = associationsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    const events = eventsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    const admins = adminSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    let adminMessages = [];
    admins.forEach(admin => {
      if (Array.isArray(admin.messages)) {
        admin.messages.forEach(message => {
          adminMessages.push(message);
        });
      }
    });
    

    const allUsers = { volunteers, associations, events, admins, adminMessages };

    res.status(200).json(allUsers);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Failed to fetch all users." });
  }
};



  const getRecentUsers = async (req, res) => {
    try {
      const now = admin.firestore.Timestamp.now();
      const lastWeekSeconds = now.seconds - 7 * 24 * 60 * 60;
      const lastWeekTimestamp = new admin.firestore.Timestamp(lastWeekSeconds, 0);
  
      const volunteersSnapshot = await admin.firestore().collection("Volunteers")
        .where("currentDate", ">=", lastWeekTimestamp)
        .get();
  
      const associationsSnapshot = await admin.firestore().collection("Associations")
        .where("currentDate", ">=", lastWeekTimestamp)
        .get();

      const volunteers = volunteersSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
      const associations = associationsSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
        
      const recentUsers = { volunteers, associations };
      res.status(200).json(recentUsers);
    } catch (error) {
      console.error("Error fetching recent users:", error);
      res.status(500).json({ message: "Failed to fetch recent users." });
    }
  };
  
  const sendMessage = async (req, res) => {
    const { senderName, senderEmail, message } = req.body;
    
    const current = new Date();
    const date = current.getDate().toString();
    const month = (current.getMonth() + 1).toString();
    const year = current.getFullYear().toString();
    
    const time = `${date}/${month}/${year}`;

    const newMessage = {
        senderName: senderName,
        senderEmail: senderEmail,
        message: message,
        time: time , // this will be the current time
        isRead: false, // message read status
    };

    try {
        const adminDocRef = admin.firestore().collection("Admin").doc(`wGXnahmLP4eeCi6noRWTULU25392`);

        // using arrayUnion to add the new message to the messages array
        await adminDocRef.update({
            messages: admin.firestore.FieldValue.arrayUnion(newMessage),
        });

        res.status(200).json({ message: 'Your message has been sent!' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
};
  

module.exports = { getAllUsers, getRecentUsers, sendMessage }
