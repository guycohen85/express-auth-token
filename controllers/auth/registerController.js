const User = require('../../models/user');
const createError = require('http-errors');
const { setRefreshTokenCookie } = require('../../utils/cookies');

async function registerController(req, res, next) {
  const { error, value } = User.validate(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  const { user, accessToken, refreshToken } = await User.register(value);

  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    user: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    },
    accessToken,
  });
}

module.exports = registerController;
