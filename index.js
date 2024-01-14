require("dotenv").config();
const { Client, Intents } = require("discord.js");

const fs = require("fs");
const store = require("./state/RootStore");
const logger = require("./utils/logger");
const startServer = require("./server");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS],
});

// -----------------------
// events handling
// -----------------------

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

store.discordClient = client;

client.login(process.env.DISCORD_BOT_TOKEN);
startServer();
