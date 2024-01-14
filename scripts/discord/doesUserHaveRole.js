//
const store = require("../../state/RootStore");
const logger = require("../../utils/logger");

const removeRoleOfUser = async (userId) => {
    //
    let has_role = false;

    const getMembers = async () => {
        const servers = store.discordClient.guilds.cache.values();
        const members = [];

        for (let server of servers) {
            let member = undefined;

            try {
                member = await server.members.fetch(userId);
            } catch (error) {
                logger.error(`couldn't fetch member ${userId}`);
            }

            if (member) {
                members.push(member);
            }
        }

        return members;
    };

    const members = await getMembers();

    members.forEach((member) => {
        try {
            const hasRole = member.roles.cache.has(
                process.env.DISCORD_SOLIDER_ROLE_ID
            );

            if (hasRole) {
                has_role = true;
            }
        } catch (e) {}
    });

    return has_role;
};

module.exports = removeRoleOfUser;
