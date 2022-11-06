const express = require('express');
const router = express.Router();
const registerController = require('../controllers/auth/registerController');

// Route Parent: '/'
// router.get('/register', (req, res) => {
//   res.json({ a: 'asd' });
// });
router.post('/register', registerController);
// router.post('/login', registerController);
// router.post('/refresh-token', registerController);

module.exports = router;
