const User = require('../../models/user');
const createError = require('http-errors');
bcrypt = require('bcrypt');

async function registerController(req, res, next) {
  const { error, value } = User.validateRegistration(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  const { user, accessToken } = await User.register(value);

  await user.save();

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    refreshToken: user.refreshToken[0],
    accessToken,
  });
}

module.exports = registerController;
