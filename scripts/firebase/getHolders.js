const db = require("../../utils/firebaseDB");

const getHolders = async () =>
    (await db.ref("holders").once("value")).val() || {};

module.exports = getHolders;
