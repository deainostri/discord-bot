//
const { MessageEmbed, WebhookClient } = require("discord.js");

const webhookClient = new WebhookClient({
  url: process.env.DISCORD_MINT_ANNOUNCER_HOOK_URL,
});

//
const postNewMintMessage = async (nft_index, nft_id, receiver) => {
  //
  const embed = new MessageEmbed()
    .setColor("#0ecf55")
    .setTitle(`deainostri #${nft_index} has been minted!`)
    .setDescription(
      [
        `Mint your deainostri here: https://deainostri.com/mint`,
        "",
        `[${receiver}](https://explorer.elrond.com/accounts/${receiver}) is the proud new owner of deainostri #${nft_index}.`,
        ``,
        `View it here: https://trust.market/nft/${nft_id}`,
      ].join("\n")
    )
    .setImage(
      `https://media.elrond.com/nfts/asset/QmVnRTKTsydaPRxwqMCimLEfXJusSkRmQ5x7jcxcAzrtXy/${nft_index}.png`
    );

  await webhookClient.send({
    username: "deainostri mint announcer",
    avatarURL: "https://image.png",
    embeds: [embed],
  });
};

module.exports = postNewMintMessage;
