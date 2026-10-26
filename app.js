const express = require('express');
const mustacheExpress = require('mustache-express');
const session = require('express-session');


const { initDatabase } = require('./models/db');
const requireLogin = require('./middleware/requireLogin');
const authController = require('./controllers/authController');
const gameController = require('./controllers/gameController');


const app = express();
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Lets Express read form data (needed later for login and add/edit forms)
app.use(express.urlencoded({ extended: false }));

app.use(session({
  secret: 'rolling-die-secret',
  resave: false,
  saveUninitialized: false
}));
 

app.get('/', function(req, res) {
  res.redirect('/games');
});
app.get('/games', gameController.showPublicGames);
 

app.get('/login', authController.showLogin);
app.post('/login', authController.handleLogin);
app.get('/logout', authController.logout);
 
app.get('/manager', requireLogin, gameController.showDashboard);
app.get('/manager/add', requireLogin, gameController.showAddForm);
app.post('/manager/add', requireLogin, gameController.handleAdd);
app.get('/manager/edit/:id', requireLogin, gameController.showEditForm);
app.post('/manager/edit/:id', requireLogin, gameController.handleEdit);
app.post('/manager/delete/:id', requireLogin, gameController.handleDelete);

app.get('/games', gameController.showPublicGames);


// Set up the database first, then start listening for requests
initDatabase(function() {
  app.listen(3000, function() {
    console.log('Server listening on http://localhost:3000');
  });
});