const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

// Route Parent: '/'
// router.get('/register', (req, res) => {
//   res.json({ a: 'asd' });
// });
router.post('/register', authController.register);
// router.post('/login', registerController);
// router.post('/refresh-token', registerController);

module.exports = router;
