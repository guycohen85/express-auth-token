const User = require('../models/user');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('config');

async function register(req, res, next) {
  const { error, value } = User.validate(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  // all good, create a user
  const user = new User(value);

  // const { _id, username, email } = user;

  // const accessToken = jwt.sign(
  //   { id: _id, username, email },
  //   config.get('jwtSecret'),
  //   { expiresIn: '15m' }
  // );

  // const refreshToken = jwt.sign({}, config.get('jwtSecret'), {
  //   expiresIn: '15 days',
  // });

  res.json(user);
  // res.json({ accessToken, refreshToken });
}

module.exports = {
  register,
};
