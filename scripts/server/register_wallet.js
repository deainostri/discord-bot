const { MessageEmbed } = require("discord.js");
const store = require("../../state/RootStore");
const logger = require("../../utils/logger");
const removeUsersFromAddress = require("../firebase/removeUsersFromAddress");
const updateUserAddress = require("../firebase/updateUserAddress");
const refreshRoleOfAddress = require("../discord/refreshRoleOfAddress");

const process_new_mint = async (req, res) => {
    try {
        const { discord_user_id, wallet_address, force } = req.body;

        if (!discord_user_id || !wallet_address) {
            logger.info(`Invalid arguments`);
            return res.send({ error: true, message: "invalid args" });
        }

        store.register.removeExpired();
        const registerReq = store.register.map.get(`${discord_user_id}`);

        if (!registerReq && force !== "yes") {
            logger.info(`No registration request for ${discord_user_id}`);
            return res.send({ error: true, message: "expired" });
        }

        await removeUsersFromAddress(wallet_address, discord_user_id);
        await updateUserAddress(discord_user_id, wallet_address);
        await refreshRoleOfAddress(wallet_address);

        if (registerReq && registerReq.interaction) {
            const mainEmbed = new MessageEmbed()
                .setColor("#0ecf55")
                .setTitle("Registration Successful")
                .setDescription(
                    `${wallet_address} has been assigned to your Discord account.`
                );

            await registerReq.interaction.editReply({
                ephemeral: true,
                embeds: [mainEmbed],
                components: [],
            });
        } else {
            logger.info(`No interaction found for ${discord_user_id}`);
        }

        return res.send({ data: "done" });
    } catch (e) {
        logger.error(e);
    }

    res.send({ data: "nope" });
};

module.exports = process_new_mint;
