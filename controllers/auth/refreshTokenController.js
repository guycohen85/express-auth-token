const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Joi = require('joi');
const { validateToken, createAccessToken, createRefreshToken } = require('../../utils/tokens');
const { setRefreshTokenCookie, deleteRefreshTokenCookie } = require('../../utils/cookies');
const { validateObjectId } = require('../../validations/objectId');

async function refreshTokenController(req, res, next) {
  const token = req.cookies['token'];

  if (!token) {
    return next(createError(401, 'No token provided'));
  }

  let tokenData;
  try {
    tokenData = validateToken(token);
  } catch (error) {
    return next(createError(401, error.message));
  }

  // Validate user id
  const {
    error,
    value: { id },
  } = validateObjectId(tokenData.id);

  if (error) return next(createError(401, error));

  // Find user
  const user = await User.findById(id);
  if (!user) return createError(401, 'User not exists');

  // Validate token exists
  let hashToken;
  for (userToken of user.refreshToken) {
    hashToken = await bcrypt.compare(token, userToken);
    if (hashToken) {
      hashToken = userToken;
      break;
    }
  }

  if (!hashToken) {
    deleteRefreshTokenCookie(res);
    user.refreshToken = [];
    await user.save();
    return next(createError(401, 'Token is not valid'));
  }

  // Create new refresh token
  const index = user.refreshToken.indexOf(hashToken);
  const refreshToken = createRefreshToken(user.id);
  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken[index] = hashRefreshToken;
  await user.save();

  const accessToken = createAccessToken(user.toObject());

  setRefreshTokenCookie(res, refreshToken);

  res.json({ accessToken });
}

module.exports = refreshTokenController;
