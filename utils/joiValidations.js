const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

exports.objectId = Joi.objectId();

exports.email = Joi.string()
  // .email({ tlds: { allow: false } })
  .email()
  .min(5)
  .max(255)
  .required();

exports.password = Joi.string().min(3).max(30).required();

exports.name = Joi.string().alphanum().min(2).max(30).required();

exports.roles = Joi.array().items(Joi.string().valid('admin', 'editor'));
