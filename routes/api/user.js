const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');

router.get('/user', userController.findAll);
router.get('/user/:id', userController.findOne);
router.post('/user', userController.create);
router.put('/user', userController.update);
router.delete('/user', userController.delete);

module.exports = router;
