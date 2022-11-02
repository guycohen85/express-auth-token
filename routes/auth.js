const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth/register');

// Route: '/'
router.post('/register', registerController);
router.post('/login', registerController);
router.post('/refresh-token', registerController);

module.exports = router;
