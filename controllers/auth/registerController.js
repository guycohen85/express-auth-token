const User = require('../../models/user');
const createError = require('http-errors');
bcrypt = require('bcrypt');
const { setRefreshTokenCookie } = require('../../utils/cookies');

async function registerController(req, res, next) {
  const { error, value } = User.validateRegistration(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  const { user, accessToken } = await User.register(value);

  await user.save();

  setRefreshTokenCookie(res, user.refreshToken[0]);

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    refreshToken: user.refreshToken[0],
    accessToken,
  });
}

module.exports = registerController;
