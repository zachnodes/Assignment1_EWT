const { SlashCommandBuilder } = require('discord.js');
const gameModel = require('../models/gameModel');

// ---------- Command definitions (what Discord shows in the / menu) ----------

const stockCommand = new SlashCommandBuilder()
  .setName('stock')
  .setDescription('Check if a game is in stock')
  .addStringOption((option) => {
    return option.setName('title').setDescription('The game title').setRequired(true);
  });

const priceCommand = new SlashCommandBuilder()
  .setName('price')
  .setDescription('Look up the price of a game')
  .addStringOption((option) => {
    return option.setName('title').setDescription('The game title').setRequired(true);
  });

const playersCommand = new SlashCommandBuilder()
  .setName('players')
  .setDescription('Find games for a number of players')
  .addIntegerOption((option) => {
    return option.setName('count').setDescription('How many people are playing').setRequired(true).setMinValue(1);
  });

const commandData = [stockCommand, priceCommand, playersCommand];

// ---------- Command handlers ----------
// Each one queries the database fresh (no saved results), replies in Discord,
// then calls done() with a short summary for the manager's live activity feed.

const sendReply = (interaction, message) => {
  interaction.reply(message).catch((err) => {
    console.log('Error replying in Discord:', err);
  });
}

const handleStock = (interaction, done) => {
  const title = interaction.options.getString('title');

  gameModel.getGameByTitle(title, (err, game) => {
    if (err) {
      sendReply(interaction, 'Sorry, something went wrong. Try again in a bit.');
    } else if (!game) {
      sendReply(interaction, 'We don\'t carry "' + title + '".');
    } else if (game.stock > 0) {
      sendReply(interaction, 'Yes! We have ' + game.stock + ' cop' + (game.stock === 1 ? 'y' : 'ies') + ' of ' + game.title + ' in stock.');
    } else {
      sendReply(interaction, game.title + ' is out of stock right now.');
    }
    done('/stock ' + title);
  });
}

const handlePrice = (interaction, done) => {
  const title = interaction.options.getString('title');

  gameModel.getGameByTitle(title, (err, game) => {
    if (err) {
      sendReply(interaction, 'Sorry, something went wrong. Try again in a bit.');
    } else if (!game) {
      sendReply(interaction, 'We don\'t carry "' + title + '".');
    } else {
      sendReply(interaction, game.title + ' is $' + game.price.toFixed(2) + '.');
    }
    done('/price ' + title);
  });
}

const handlePlayers = (interaction, done) => {
  const count = interaction.options.getInteger('count');

  gameModel.getGamesByPlayerCount(count, (err, games) => {
    if (err) {
      sendReply(interaction, 'Sorry, something went wrong. Try again in a bit.');
    } else if (games.length === 0) {
      sendReply(interaction, 'We don\'t have any games for ' + count + ' players.');
    } else {
      let message = 'Games for ' + count + ' players:\n';
      for (let i = 0; i < games.length; i++) {
        message += '- ' + games[i].title + ' (' + games[i].min_players + '-' + games[i].max_players + ' players)\n';
      }
      sendReply(interaction, message);
    }
    done('/players ' + count);
  });
}

// Picks the right handler based on which command was used.
const handleCommand = (interaction, done) => {
  if (interaction.commandName === 'stock') {
    handleStock(interaction, done);
  } else if (interaction.commandName === 'price') {
    handlePrice(interaction, done);
  } else if (interaction.commandName === 'players') {
    handlePlayers(interaction, done);
  }
}

module.exports = { commandData, handleCommand };