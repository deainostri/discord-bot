const db = require("../../utils/firebaseDB");

const updateUserAddress = async (user_id, address) => {
    if (!user_id || !address) {
        return;
    }

    await db.ref(`holders/${address}`).update({
        user_id: `${user_id}`,
        discord_id: `${user_id}`,
    });

    await db.ref(`users/${user_id}`).update({
        user_id: `${user_id}`,
        discord_id: `${user_id}`,
        address: `${address}`,
        wallet_address: `${address}`,
    });
};

module.exports = updateUserAddress;
