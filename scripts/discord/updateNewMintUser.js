//
const db = require("../../utils/firebaseDB");
const store = require("../../state/RootStore");
const getNfts = require("../firebase/getNfts");
const getHolders = require("../firebase/getHolders");

const updateNewMintUser = async (address, nft_id) => {
    //
    const allNftsMap = await getNfts();
    const allHoldersMap = await getHolders();

    if (!allHoldersMap[address] || !allHoldersMap[address].discord_id) {
        return;
    }

    allHoldersMap[address].balance = Number(allHoldersMap[address].balance) + 1;
    allNftsMap[nft_id] = address;

    await db.ref("nfts").update(allNftsMap);
    await db.ref("holders").update(allHoldersMap);

    const userId = allHoldersMap[address].discord_id;
    const servers = store.discordClient.guilds.cache.values();

    for (let server of servers) {
        console.log(server);
        const member = await server.members.fetch(userId);

        if (member) {
            try {
                member.roles.add([process.env.DISCORD_SOLIDER_ROLE_ID]);
            } catch (e) {}
        }
    }
};

module.exports = updateNewMintUser;
