const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
} = require('../../controllers/auth');

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/logout', auth, logoutController);
router.post('/refresh-token', refreshTokenController);

router.get('/open', (req, res, next) => {
  res.json({ open: 'open' });
});

module.exports = router;
