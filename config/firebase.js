const admin = require("firebase-admin");

const serviceAccount = require("../config/todox-186e9-firebase-adminsdk-fbsvc-1304f80906.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();


module.exports = {db}