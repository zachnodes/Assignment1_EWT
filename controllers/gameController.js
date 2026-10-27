const gameModel = require('../models/gameModel');

// ---------- Public page (no login) ----------

const showPublicGames = (req, res) => {
  gameModel.getAllGames((err, games) => {
    if (err) {
      res.send('Something went wrong');
      console.log(err);
      return;
    }
    res.render('games', { games: games });
  });
}

// ---------- Manager pages (login required) ----------

// Pulls the game fields out of a submitted form and converts numbers.
// Empty optional fields become null.
const readGameFromForm = (body) => {
  return {
    title: body.title.trim(),
    category: body.category ? body.category.trim() : null,
    price: parseFloat(body.price),
    stock: parseInt(body.stock),
    min_players: body.min_players ? parseInt(body.min_players) : null,
    max_players: body.max_players ? parseInt(body.max_players) : null,
    description: body.description ? body.description.trim() : null
  };
}

// Returns an error message, or null if the game looks fine.
const checkGame = (game) => {
  if (!game.title) {
    return 'Title is required.';
  }
  if (isNaN(game.price) || game.price < 0) {
    return 'Price must be a number of 0 or more.';
  }
  if (isNaN(game.stock) || game.stock < 0) {
    return 'Stock must be a whole number of 0 or more.';
  }
  return null;
}

// Turns a database error into a message the manager can understand.
const friendlyError = (err) => {
  if (err.message.includes('UNIQUE')) {
    return 'A game with that title already exists.';
  }
  return 'Something went wrong saving the game.';
}

const showDashboard = (req, res) => {
  gameModel.getAllGames((err, games) => {
    if (err) {
      res.send('Something went wrong');
      return;
    }
    res.render('manager', { username: req.session.username, games: games });
  });
}

const showAddForm = (req, res) => {
  res.render('gameForm', { heading: 'Add Game', action: '/manager/add' });
}

const handleAdd = (req, res) => {
  const game = readGameFromForm(req.body);
  const problem = checkGame(game);

  if (problem) {
    res.render('gameForm', { heading: 'Add Game', action: '/manager/add', game: game, error: problem });
    return;
  }

  gameModel.addGame(game, (err) => {
    if (err) {
      res.render('gameForm', { heading: 'Add Game', action: '/manager/add', game: game, error: friendlyError(err) });
      return;
    }
    res.redirect('/manager');
  });
}

const showEditForm = (req, res) => {
  gameModel.getGameById(req.params.id, (err, game) => {
    if (err || !game) {
      res.redirect('/manager');
      return;
    }
    res.render('gameForm', { heading: 'Edit Game', action: '/manager/edit/' + game.id, game: game });
  });
}

const handleEdit = (req, res) => {
  const id = req.params.id;
  const game = readGameFromForm(req.body);
  const problem = checkGame(game);
  const action = '/manager/edit/' + id;

  if (problem) {
    res.render('gameForm', { heading: 'Edit Game', action: action, game: game, error: problem });
    return;
  }

  gameModel.updateGame(id, game, (err) => {
    if (err) {
      res.render('gameForm', { heading: 'Edit Game', action: action, game: game, error: friendlyError(err) });
      return;
    }
    res.redirect('/manager');
  });
}

const handleDelete = (req, res) => {
  gameModel.deleteGame(req.params.id, (err) => {
    if (err) {
      console.log('Error deleting game:', err);
    }
    res.redirect('/manager');
  });
}

module.exports = {
  showPublicGames,
  showDashboard,
  showAddForm,
  handleAdd,
  showEditForm,
  handleEdit,
  handleDelete
};