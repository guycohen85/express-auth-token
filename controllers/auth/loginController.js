const User = require('../../models/user');
const createError = require('http-errors');
const bcrypt = require('bcrypt');

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

  res.json({
    id: user.id,
    username: user.username,
    email: user.email,
    refreshToken,
    accessToken,
  });
}

module.exports = loginController;
