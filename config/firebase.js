const admin = require("firebase-admin");

const serviceAccount = require("../config/todox-186e9-firebase-adminsdk-fbsvc-f2d6a39175.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
const fadmin = admin


module.exports = {db, fadmin};