const gameModel = require('../models/gameModel');

function showPublicGames(req, res) {
  gameModel.getAllGames(function(err, games) {
    if (err) {
      res.send('Something went wrong');
      return;
    }
    res.render('games', { games: games });
  });
}

module.exports = { showPublicGames };