const admin = require("firebase-admin");
const dotenv = require("dotenv")

dotenv.config()


const serviceAccount = require(`./${process.env.FIREBASE_KEYS}`);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


const db = admin.firestore();
const fadmin = admin


module.exports = {db, fadmin};