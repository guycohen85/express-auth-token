const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const {
  extractHeaderToken,
  validateToken,
  createUserAccessToken,
  createRefreshToken,
} = require('../../utils/tokens');
const { setRefreshTokenCookie } = require('../../utils/cookies');

async function refreshTokenController(req, res, next) {
  // Validate token
  const [token, headerError] = extractHeaderToken(req);

  if (headerError) {
    return next(createError(400, headerError.message));
  }

  const [tokenValue, validationError] = validateToken(token);
  if (validationError) next(createError(400, validationError));

  // Validate token user id
  const schema = Joi.object({ id: Joi.objectId() });
  const {
    error,
    value: { id },
  } = schema.validate({ id: tokenValue.id });

  if (error) return next(createError(400, error));

  // Find user
  const user = await User.findById(tokenValue.id);
  if (!user) return createError(400, 'User not exists');

  // Validate token exists
  let hashToken;
  for (userToken of user.refreshToken) {
    hashToken = await bcrypt.compare(token, userToken);
    if (hashToken) break;
  }

  if (!hashToken) {
    user.refreshToken = [];
    await user.save();
    return next(createError(400, 'Token is not valid'));
  }

  // Create new refresh token
  const index = user.refreshToken.indexOf(hashToken);
  const refreshToken = createRefreshToken(user.id);
  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken[index] = hashRefreshToken;
  await user.save();

  const accessToken = createUserAccessToken(user);

  setRefreshTokenCookie(res, refreshToken);

  res.json({ accessToken });
}

module.exports = refreshTokenController;
