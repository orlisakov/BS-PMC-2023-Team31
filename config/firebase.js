const admin = require('firebase-admin');
const credentials = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(credentials),
  databaseURL: "https://giveshand---website-project.firebaseio.com"
});

module.exports = admin;