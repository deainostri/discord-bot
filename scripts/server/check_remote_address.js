//
const logger = require("../../utils/logger");
const refreshRoleOfAddress = require("../discord/refreshRoleOfAddress");

const process_new_mint = async (req, res) => {
    try {
        const { wallet_address } = req.body;

        if (!wallet_address) {
            logger.info(`Invalid arguments`);
            return res.send({ error: true, message: "invalid args" });
        }

        await refreshRoleOfAddress(wallet_address);

        return res.send({ data: "done" });
    } catch (e) {
        logger.error(e);
    }

    res.send({ data: "nope" });
};

module.exports = process_new_mint;
