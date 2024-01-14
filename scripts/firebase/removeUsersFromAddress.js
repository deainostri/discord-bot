const db = require("../../utils/firebaseDB");
const getUsers = require("./getUsers");
const removeRoleOfUser = require("../discord/removeRoleOfUser");

const removeUsersFromAddress = async (address, except_user_id) => {
    if (!address) {
        return;
    }

    const allUsersMap = await getUsers();
    // TODO: remove discord_id & user_id from holders map

    for (let key in allUsersMap) {
        const user = allUsersMap[key];

        if (user.address != address) {
            continue;
        }

        if (user.discord_id == except_user_id) {
            continue;
        }

        user.address = "";
        user.wallet_address = "";

        logger.info(
            `[removeUsersFromAddress] Removing role from ${user.discord_user_id} `
        );
        removeRoleOfUser(user.discord_id);
    }

    await db.ref("users").update(allUsersMap);
};

module.exports = removeUsersFromAddress;
