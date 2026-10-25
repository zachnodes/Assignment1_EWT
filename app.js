const express = require('express');
const mustacheExpress = require('mustache-express');

const { initDatabase } = require('./models/db');

const gameController = require('./controllers/gameController');


const app = express();
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Lets Express read form data (needed later for login and add/edit forms)
app.use(express.urlencoded({ extended: false }));

// Temporary test route, replace once Mustache views are set up
app.get('/', function(req, res) {
  res.send('Server is running');
});

app.get('/games', gameController.showPublicGames);


// Set up the database first, then start listening for requests
initDatabase(function() {
  app.listen(3000, function() {
    console.log('Server listening on http://localhost:3000');
  });
});