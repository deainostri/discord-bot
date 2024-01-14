const admin = require("firebase-admin");
const firebaseAccount = require("../firebase-admin-credentials.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(firebaseAccount),
    databaseURL: "xxx",
  });
}

const db = admin.database();

module.exports = db;
