const logger = require("../../utils/logger");
const updateNewMintUser = require("../discord/updateNewMintUser");
const postNewMintMessage = require("../discord/postNewMintMessage");

const process_new_mint = async (req, res) => {
    try {
        const { nft_id, nft_index, receiver } = req.body;

        if (!nft_id || !receiver) {
            throw "e";
        }

        await postNewMintMessage(nft_index, nft_id, receiver);
        await updateNewMintUser(receiver, nft_id);
        return res.send({ data: "done" });
    } catch (e) {
        logger.error(e);
    }

    res.send({ data: "nope" });
};

module.exports = process_new_mint;
