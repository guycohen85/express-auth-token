const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const registerController = require('../../controllers/auth/registerController');
const loginController = require('../../controllers/auth/loginController');
const logoutController = require('../../controllers/auth/logoutController');
const refreshTokenController = require('../../controllers/auth/refreshTokenController');

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', auth, logoutController);
router.post('/refresh-token', refreshTokenController);

module.exports = router;
