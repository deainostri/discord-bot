// utils
const { MessageEmbed } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
const logger = require("../utils/logger");

// state
const store = require("../state/RootStore");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Bind your wallet address to your Discord account."),

  execute: async (interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const userId = interaction.user.id;

    const mainEmbed = new MessageEmbed()
      .setColor("#0ecf55")
      .setTitle("Register Wallet")
      .setURL(`https://deainostri.com/discord/${userId}`)
      .setDescription(
        [
          `Click on the following link in order to register your ERD address to your Discord account!`,
          ``,
          `https://deainostri.com/discord/${userId}`,
        ].join("\n")
      );

    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setURL(`https://deainostri.com/discord/${userId}`)
        .setLabel("Connect Wallet")
        .setStyle("LINK")
    );

    await interaction.editReply({
      ephemeral: true,
      embeds: [mainEmbed],
      components: [row],
    });

    // registers intent to reigster wallet
    store.register.add(userId, { interaction });
  },
};
