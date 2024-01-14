const db = require("../../utils/firebaseDB");
const getUsers = async () => (await db.ref("users").once("value")).val() || {};

module.exports = getUsers;
