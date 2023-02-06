const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const admin = require('../../middleware/roles/admin');
const editor = require('../../middleware/roles/editor');
const owner = require('../../middleware/roles/owner');

router.get('/user', editor, userController.findAll);
router.get('/user/:id', owner, userController.findOne);
router.post('/user', admin, userController.create);
router.put('/user/:id', owner, userController.update);
router.delete('/user/:id', owner, userController.delete);

module.exports = router;
