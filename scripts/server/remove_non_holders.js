// firebase
const db = require("../../utils/firebaseDB");
const getNfts = require("../firebase/getNfts");
const getUsers = require("../firebase/getUsers");
const getHolders = require("../firebase/getHolders");
const getUserDetails = require("../firebase/getUserDetails");

//
const updateUserAddress = require("../firebase/updateUserAddress");
const refreshRoleOfAddress = require("../discord/refreshRoleOfAddress");
const removeUsersFromAddress = require("../firebase/removeUsersFromAddress");

const doesUserHaveRole = require("../discord/doesUserHaveRole");
const removeRoleOfUser = require("../discord/removeRoleOfUser");
const updateRoleOfAddress = require("../discord/updateRoleOfAddress");

// utils
const axios = require("../../utils/axios");
const store = require("../../state/RootStore");
const logger = require("../../utils/logger");
const { MessageEmbed } = require("discord.js");

const remove_non_holders = async (req, res) => {
    //
    const nftsMap = await getNfts();
    const usersMap = await getUsers();
    const holdersMap = await getHolders();

    const newNfts = {};
    const newHoldersBalance = {};

    let from = 0;
    let size = 100;
    let maxFrom = 100;
    let result = await axios.get(
        `https://api.elrond.com/collections/DEAINOSTRI-a141fb/nfts/count`
    );
    maxFrom = Number(result.data);

    for (from = 0; from <= maxFrom; from += size) {
        result = await axios.get(
            `https://api.elrond.com/collections/DEAINOSTRI-a141fb/nfts?from=${from}&size=${size}&withOwner=true`
        );

        let nfts = result.data || [];

        for (let nft of nfts) {
            // saving address of owner
            newNfts[nft.identifier] = nft.owner;

            // saving balance of owner
            if (newHoldersBalance[nft.owner]) {
                newHoldersBalance[nft.owner] = newHoldersBalance[nft.owner] + 1;
            } else {
                newHoldersBalance[nft.owner] = 1;
            }

            // removing nft from holders
            if (
                nftsMap[nft.identifier] &&
                nftsMap[nft.identifier] != nft.owner
            ) {
                logger.info(
                    `${nft.identifier} is not owned by ${
                        nftsMap[nft.identifier]
                    } anymore.`
                );
            }
        }
    }

    logger.info(`Building the map and processing data...`);

    for (let addr in holdersMap) {
        //
        const discord_id = `${holdersMap[addr].discord_id}`;

        if (!newHoldersBalance[addr]) {
            // update balance
            holdersMap[addr].balance = 0;

            // do nothing else if no user is provided
            if (!discord_id) {
                continue;
            }

            // user has other main wallet registered
            if (
                usersMap[discord_id] &&
                usersMap[discord_id].wallet_address !== addr
            ) {
                logger.info(
                    `User ${addr} has other wallet connected as main ${usersMap[discord_id].wallet_address}`
                );
                continue;
            }

            const hasRole = await doesUserHaveRole(`${discord_id}`);

            // skip removing role if user doesn't have it
            if (!hasRole) {
                continue;
            }

            logger.info(
                `${addr} is not a holder anymore. removing citizen role...`
            );

            try {
                discord_id && (await removeRoleOfUser(discord_id));
            } catch (e) {
                logger.error(
                    `couldn't update for ${addr} - ${discord_id} (left the server)`
                );
            }
        } else if (newHoldersBalance[addr] != holdersMap[addr].balance) {
            logger.info(
                `${addr} has a new balance of ${
                    newHoldersBalance[addr]
                } (they had: ${holdersMap[addr].balance || 0}).`
            );

            holdersMap[addr].balance = newHoldersBalance[addr];

            try {
                discord_id && (await updateRoleOfAddress(addr, holdersMap));
            } catch (e) {
                logger.error(
                    `couldn't update for ${addr} - ${discord_id} (left the server)`
                );
            }
        }
    }

    logger.info(`Updating NFTs data...`);
    await db.ref("nfts").update(newNfts);
    logger.info(`Updating Holders data...`);
    await db.ref("holders").update(holdersMap);

    logger.info(`Script done!`);
    res.send({ data: "done" });
};

module.exports = remove_non_holders;
