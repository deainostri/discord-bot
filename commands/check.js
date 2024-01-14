// utils
const { SlashCommandBuilder } = require("@discordjs/builders");
const logger = require("../utils/logger");

// discord
const updateRoleOfAddress = require("../scripts/discord/updateRoleOfAddress");

// elrond
const getNftsOfAddress = require("../scripts/elrond/getNftsOfAddress");

// firebase
const db = require("../utils/firebaseDB");
const getNfts = require("../scripts/firebase/getNfts");
const getUsers = require("../scripts/firebase/getUsers");
const getHolders = require("../scripts/firebase/getHolders");
const getUserDetails = require("../scripts/firebase/getUserDetails");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("check")
        .setDescription(
            "View how many deainostri I have and update my Discord role!"
        ),

    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const userId = interaction.user.id;

        if (!userId) {
            await interaction.editReply(`Discord internal error.`, {
                ephemeral: true,
            });

            return logger.info(`No user id found from the interaction.`);
        }

        let userDetails = null;
        let address = "";

        try {
            userDetails = await getUserDetails(`${userId}`);
        } catch (err) {
            await interaction.editReply(`Fetching user failed.`, {
                ephemeral: true,
            });

            return logger.error(
                `Could not fetch user details for user ${userId}`
            );
        }

        if (userDetails) {
            address = userDetails.wallet_address || "";
        }

        if (!address) {
            await interaction.editReply(
                `Couldn't find a wallet address bound to this account. Please use "/register" to register your wallet address.`,
                {
                    ephemeral: true,
                }
            );

            return logger.info(
                `No wallet address for ${userId} found in the database.`
            );
        }

        const current_user_nfts = await getNftsOfAddress(address);
        const allNftsMap = await getNfts();
        const allHoldersMap = await getHolders();

        if (!allHoldersMap[address]) {
            allHoldersMap[address] = {
                balance: 0,
                user_id: `${userId}`,
                discord_id: `${userId}`,
            };
        } else {
            allHoldersMap[address].balance = 0;
            allHoldersMap[address].discord_id = userId;
        }

        for (let i = 0; i < current_user_nfts.length; i++) {
            let nft = current_user_nfts[i];

            if (
                allNftsMap[nft.identifier] &&
                allNftsMap[nft.identifier] != address &&
                allHoldersMap[allNftsMap[nft.identifier]]
            ) {
                allHoldersMap[allNftsMap[nft.identifier]].balance = Math.max(
                    0,
                    Number(allHoldersMap[allNftsMap[nft.identifier]].balance) -
                        1
                );

                try {
                    await updateRoleOfAddress(
                        allNftsMap[nft.identifier],
                        allHoldersMap,
                        interaction
                    );
                } catch (e) {}
            }

            allNftsMap[nft.identifier] = address;
            allHoldersMap[address].balance =
                Number(allHoldersMap[address].balance) + 1;
        }

        // update db
        await Promise.all([
            db.ref("nfts").update(allNftsMap),
            db.ref("holders").update(allHoldersMap),
            updateRoleOfAddress(address, allHoldersMap, interaction),
        ]);
        // await db.ref("nfts").update(allNftsMap);
        // await db.ref("holders").update(allHoldersMap);

        // await updateRoleOfAddress(address, allHoldersMap, interaction);

        await interaction.editReply(
            `Your user has been updated successfully!`,
            {
                ephemeral: true,
            }
        );
    },
};
