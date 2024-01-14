//
const store = require("../../state/RootStore");

const removeRoleOfUser = async (userId) => {
    //
    const getMembers = async () => {
        const servers = store.discordClient.guilds.cache.values();
        const members = [];

        for (let server of servers) {
            const member = await server.members.fetch(userId);

            if (member) {
                members.push(member);
            }
        }

        return members;
    };

    (await getMembers()).forEach((member) => {
        try {
            member.roles.remove([process.env.DISCORD_SOLIDER_ROLE_ID]);
        } catch (e) {}
    });
};

module.exports = removeRoleOfUser;
