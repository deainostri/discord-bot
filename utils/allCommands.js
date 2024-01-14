const fs = require("fs");
const { Collection } = require("discord.js");

const commands = new Collection();

const commandFiles = fs
    .readdirSync("./commands")
    .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.set(command.data.name, command);
}

module.exports = commands;
