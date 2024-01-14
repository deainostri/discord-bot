const db = require("../../utils/firebaseDB");
const getNfts = async () => (await db.ref("nfts").once("value")).val() || {};

module.exports = getNfts;
