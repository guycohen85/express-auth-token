const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const {
  validateToken,
  createUserAccessToken,
  createRefreshToken,
} = require('../../utils/tokens');
const {
  setRefreshTokenCookie,
  deleteRefreshTokenCookie,
} = require('../../utils/cookies');

async function refreshTokenController(req, res, next) {
  const token = req.cookies['token'];

  if (!token) {
    return next(createError(401, 'No token provided'));
  }

  const validationError = validateToken(token);
  if (validationError) next(createError(401, validationError));

  // Validate user id
  const schema = Joi.object({ id: Joi.objectId() });
  const {
    error,
    value: { id },
  } = schema.validate({ id: req.body.id });

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
  const refreshToken = createRefreshToken();
  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken[index] = hashRefreshToken;
  await user.save();

  const accessToken = createUserAccessToken(user);

  setRefreshTokenCookie(res, refreshToken);

  res.json({ accessToken });
}

module.exports = refreshTokenController;
