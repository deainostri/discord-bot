//
const store = require("../../state/RootStore");
const logger = require("../../utils/logger");

const updateRoleOfAddress = async (address, holders, interaction) => {
    const shouldHave = holders[address].balance > 0;
    const userId = holders[address].discord_id;

    // let role = interaction.guild.roles.cache.entries();
    // console.log(Array.from(role));

    const getMembers = async () => {
        const servers = store.discordClient.guilds.cache.values();
        const members = [];

        for (let server of servers) {
            let member = null;

            try {
                member = await server.members.fetch(userId);
            } catch (e) {
                logger.error(
                    `Couldn't fetch member ${userId} on server ${server}`
                );
            }

            if (member) {
                members.push(member);
            }
        }

        return members;
    };

    const addRole = async () => {
        if (interaction) {
            return interaction.member.roles.add([
                process.env.DISCORD_SOLIDER_ROLE_ID,
            ]);
        } else {
            (await getMembers()).forEach((member) => {
                try {
                    member.roles.add([process.env.DISCORD_SOLIDER_ROLE_ID]);
                } catch (e) {}
            });
        }
    };

    const removeRole = async () => {
        if (interaction) {
            return interaction.member.roles.remove([
                process.env.DISCORD_SOLIDER_ROLE_ID,
            ]);
        } else {
            (await getMembers()).forEach((member) => {
                try {
                    member.roles.remove([process.env.DISCORD_SOLIDER_ROLE_ID]);
                } catch (e) {}
            });
        }
    };

    if (shouldHave) {
        addRole();
    } else {
        removeRole();
    }
};

module.exports = updateRoleOfAddress;
