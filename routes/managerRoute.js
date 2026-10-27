const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const gameController = require('../controllers/gameController');


router.get('/', requireLogin, gameController.showDashboard);
router.get('/add', requireLogin, gameController.showAddForm);
router.post('/add', requireLogin, gameController.handleAdd);
router.get('/edit/:id', requireLogin, gameController.showEditForm);
router.post('/edit/:id', requireLogin, gameController.handleEdit);
router.post('/delete/:id', requireLogin, gameController.handleDelete);

module.exports = router