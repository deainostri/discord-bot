// utils
const logger = require("../../utils/logger");

// discord
const updateRoleOfAddress = require("../discord/updateRoleOfAddress");

// elrond
const getNftsOfAddress = require("../elrond/getNftsOfAddress");

// firebase
const db = require("../../utils/firebaseDB");
const getNfts = require("../firebase/getNfts");
const getUsers = require("../firebase/getUsers");
const getHolders = require("../firebase/getHolders");
const getUserDetails = require("../firebase/getUserDetails");

const refreshRoleOfAddress = async (address) => {
    if (!address) {
        return logger.info(`[refreshRoleOfAddress] No wallet address given.`);
    }

    const current_user_nfts = await getNftsOfAddress(address);
    const allNftsMap = await getNfts();
    const allHoldersMap = await getHolders();

    if (!allHoldersMap[address] || !allHoldersMap[address].discord_id) {
        return logger.info(
            `[refreshRoleOfAddress] No discord id found for address ${address}.`
        );
    }

    allHoldersMap[address].balance = 0;

    for (let i = 0; i < current_user_nfts.length; i++) {
        let nft = current_user_nfts[i];

        if (
            allNftsMap[nft.identifier] &&
            allNftsMap[nft.identifier] != address &&
            allHoldersMap[allNftsMap[nft.identifier]]
        ) {
            logger.info(
                `[refreshRoleOfAddress] Removing from balance of ${
                    allNftsMap[nft.identifier]
                }.`
            );
            allHoldersMap[allNftsMap[nft.identifier]].balance =
                Number(allHoldersMap[allNftsMap[nft.identifier]].balance) - 1;

            try {
                logger.info(
                    `[refreshRoleOfAddress] Updating ${
                        allNftsMap[nft.identifier]
                    }'s add role.`
                );
                await updateRoleOfAddress(
                    allNftsMap[nft.identifier],
                    allHoldersMap
                );
            } catch (e) {}
        }

        allNftsMap[nft.identifier] = address;
        allHoldersMap[address].balance =
            Number(allHoldersMap[address].balance || 0) + 1;
    }

    // update db
    await db.ref("nfts").update(allNftsMap);
    await db.ref("holders").update(allHoldersMap);

    await updateRoleOfAddress(address, allHoldersMap);
};

module.exports = refreshRoleOfAddress;
