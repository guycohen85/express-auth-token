const User = require('../../models/user');
const createError = require('http-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const { deleteRefreshTokenCookie } = require('../../utils/cookies');

async function logoutController(req, res, next) {
  // TODO: extract all validations to util file
  const schema = Joi.object({ id: Joi.objectId() });
  const {
    error,
    value: { id },
  } = schema.validate({ id: req.body.id });

  if (error) return next(createError(400, error));

  const user = await User.findById(id);
  if (!user) return next(createError(400, 'User not exists'));

  user.refreshToken = [];
  await user.save();

  deleteRefreshTokenCookie(res);

  res.end();
}

module.exports = logoutController;
