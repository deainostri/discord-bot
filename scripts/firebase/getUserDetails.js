const db = require("../../utils/firebaseDB");

const getUserDetails = async (userId) =>
    (await db.ref(`users/${userId}`).once("value")).val();

module.exports = getUserDetails;
