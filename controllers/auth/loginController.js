const User = require('../../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');
const { setRefreshTokenCookie } = require('../../utils/cookies');

async function loginController(req, res, next) {
  const {
    error,
    value: { email, password },
  } = User.validateLogin(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const user = await User.findOne({ email });

  if (!user) return next(createError(401, 'Invalid email or password'));

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect)
    return next(createError(401, 'Invalid email or password'));

  const { accessToken, refreshToken } = await user.login();

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    refreshToken,
    accessToken,
  });
}

module.exports = loginController;
