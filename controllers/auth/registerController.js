const User = require('../../models/user');
const createError = require('http-errors');
const { setRefreshTokenCookie } = require('../../utils/cookies');
const { validateRegister } = require('../../validations/user');

async function registerController(req, res, next) {
  const { error, value } = validateRegister(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  const { user, accessToken, refreshToken } = await User.register(value);

  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    user: user.toObject(),
    accessToken,
  });
}

module.exports = registerController;
