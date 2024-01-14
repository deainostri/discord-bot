const allCommands = require("../utils/allCommands");
const logger = require("../utils/logger");

module.exports = {
    name: "interactionCreate",
    execute: async (interaction) => {
        if (!interaction.isCommand()) return;

        logger.info(
            `${interaction.user.tag}(${interaction.user.id}) in #${interaction.channel.name} triggered an interaction.`
        );

        const command = allCommands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            logger.error(error);
            await interaction.reply({
                content: "There was an error while executing this command!",
                ephemeral: true,
            });
        }
    },
};
