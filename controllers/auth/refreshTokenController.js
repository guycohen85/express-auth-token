const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/user');
const { getUserAccessToken, getRefreshToken } = require('../../utils/tokens');

async function refreshTokenController(req, res, next) {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return next(createError(400, 'No token provided'));
  }

  const oldRefreshToken = authHeader.split(' ')[1];

  try {
    jwt.verify(oldRefreshToken, config.get('jwtSecret'));
  } catch (err) {
    return next(createError(400, err));
  }

  const user = await User.findById(req.body.id);
  const isTokenExists = user.refreshToken.includes(oldRefreshToken);

  if (!isTokenExists) {
    user.refreshToken = [];
    await user.save();
    return next(createError(400, 'Token is not valid'));
  }

  const index = user.refreshToken.indexOf(oldRefreshToken);
  const refreshToken = getRefreshToken();
  user.refreshToken[index] = refreshToken;
  await user.save();

  const accessToken = getUserAccessToken(user);

  res.json({ accessToken, refreshToken });
}

module.exports = refreshTokenController;
