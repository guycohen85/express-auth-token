const createError = require('http-errors');
const bcrypt = require('bcrypt');
const User = require('../../models/user');
const {
  extractHeaderToken,
  validateToken,
  createUserAccessToken,
  createRefreshToken,
} = require('../../utils/tokens');

async function refreshTokenController(req, res, next) {
  // Validate token
  const [token, error] = extractHeaderToken(req);

  if (error) {
    return next(createError(400, error.message));
  }

  const validationError = validateToken(token);
  if (validationError) next(createError(400, validationError));

  // Find user
  const user = await User.findById(req.body.id);
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
  const refreshToken = createRefreshToken();
  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken[index] = hashRefreshToken;
  await user.save();

  const accessToken = createUserAccessToken(user);

  res.json({ accessToken, refreshToken });
}

module.exports = refreshTokenController;
