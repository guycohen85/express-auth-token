const User = require('../../models/user');
const createError = require('http-errors');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

async function logoutController(req, res, next) {
  const schema = Joi.object({ id: Joi.objectId() });
  const {
    error,
    value: { id },
  } = schema.validate({ id: req.body.id });

  if (error) return next(createError(400, error));

  const user = await User.findById(id);
  user.refreshToken = [];
  await user.save();

  res.end();
}

module.exports = logoutController;
