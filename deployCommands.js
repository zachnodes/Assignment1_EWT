// Registers the slash commands with Discord.
// Run once with: node deploy-commands.js
// Run it again only if you add or change a command.
const { REST, Routes } = require('discord.js');
const config = require('./config.json');
const botCommands = require('./bot/commands');

// Discord wants the commands as plain JSON
const body = [];
for (let i = 0; i < botCommands.commandData.length; i++) {
  body.push(botCommands.commandData[i].toJSON());
}

const rest = new REST().setToken(config.botToken);

rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), { body: body })
  .then(() => {
    console.log('Registered ' + body.length + ' slash commands.');
  })
  .catch((err) => {
    console.log('Error registering commands:', err);
  });