const User = require('../../models/user');
const createError = require('http-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { deleteRefreshTokenCookie } = require('../../utils/cookies');
const { validateObjectId } = require('../../validations/objectId');

async function logoutController(req, res, next) {
  const {
    error,
    value: { id },
  } = validateObjectId(req.body.id);

  if (error) return next(createError(400, error));

  const user = await User.findById(id);
  if (!user) return next(createError(400, 'User not exists'));

  user.refreshToken = [];
  await user.save();

  deleteRefreshTokenCookie(res);

  res.json({ _id: user._id });
}

module.exports = logoutController;
