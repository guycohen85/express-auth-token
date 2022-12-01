const express = require('express');
const router = express.Router();
const user = require('../../controllers/userController');

router.get('/user', user.findAll);
router.get('/user/:id', user.findOne);
router.post('/user', user.create);
router.put('/user', user.update);
router.delete('/user', user.delete);

module.exports = router;
