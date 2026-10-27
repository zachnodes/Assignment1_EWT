const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const gameController = require('../controllers/gameController');


router.get('/manager', requireLogin, gameController.showDashboard);
router.get('/manager/add', requireLogin, gameController.showAddForm);
router.post('/manager/add', requireLogin, gameController.handleAdd);
router.get('/manager/edit/:id', requireLogin, gameController.showEditForm);
router.post('/manager/edit/:id', requireLogin, gameController.handleEdit);
router.post('/manager/delete/:id', requireLogin, gameController.handleDelete);

module.exports = router