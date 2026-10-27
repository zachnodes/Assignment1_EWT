const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');
const { Client, GatewayIntentBits, Events } = require('discord.js');
const { initDatabase } = require('./models/db');

const loginRoute = require('./routes/loginRoute');
const managerRoute = require('./routes/managerRoute');
const gamesRoute = require('./routes/gamesRoute');
const botCommands = require('./bot/commands');
const config = require('./config.json');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Lets Express read form data (different from experss.json(), which reads json from a fetch body)
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'rolling-die-secret',
  resave: false,
  saveUninitialized: false
}));
 
// Small redirect no need for own file
app.get('/', (req, res) => {
  res.redirect('/games');
});
// Reg routes
app.use('/login', loginRoute); 
app.use('/manager', managerRoute);
app.use('games', gamesRoute);


const client = new Client({ intents: [GatewayIntentBits.Guilds] });
 
client.once(Events.ClientReady, () => {
  console.log('Bot logged in as ' + client.user.tag);
});
 
client.on(Events.InteractionCreate, (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }
 
  // After the bot replies, push the activity to the manager dashboard
  botCommands.handleCommand(interaction, (commandText) => {
    io.emit('botactivity', {
      command: commandText,
      user: interaction.user.username,
      time: new Date().toLocaleTimeString()
    });
  });
});

// Set up the database first, then start listening for requests
initDatabase(() => {
  http.listen(3000, () => {
    console.log('Server listening on http://localhost:3000');
  });

  client.login(config.botToken).catch((err) => {
    console.log('Bot could not log in, check botToken in config.json:', err.message);
  });
});