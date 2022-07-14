/* eslint-disable max-len */
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v9');
const rest = new REST({version: '9'}).setToken(process.env.DISCORD_TOKEN);

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    const guilds = client.guilds.cache.map((guild) => guild.id);
    const commands = [];
    const commandsPath = path.join(process.cwd(), 'commands');
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      commands.push(command.data.toJSON());
    }

    for (let i = 0; i < guilds.length; i++) {
      rest.put(
          Routes.applicationGuildCommands(
              process.env.CLIENT_ID,
              guilds[i],
          ),
          {
            body: commands,
          },
      )
          .then(() =>
            console.log(
                `Successfully registered application commands for guild ${guilds[i]}.`,
            ),
          )
          .catch(console.error);
    }
  },
};
