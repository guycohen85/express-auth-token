const Joi = require('joi');
const { objectId } = require('./objectId');

const email = Joi.string()
  .email({ tlds: { allow: false } })
  .email()
  .min(5)
  .max(255)
  .required();

const password = Joi.string().min(3).max(30).required();

const name = Joi.string().alphanum().min(2).max(30).required();

const roles = Joi.array().items(Joi.string().valid('admin', 'editor'));

exports.validateLogin = (body) => {
  return Joi.object({
    email,
    password,
  }).validate(body, { abortEarly: false });
};

exports.validateRegister = (body) => {
  return Joi.object({
    email,
    password,
    firstName: name,
    lastName: name,
  }).validate(body, { abortEarly: false });
};

exports.validateCreateUser = (body) => {
  return Joi.object({
    email,
    password,
    firstName: name,
    lastName: name,
    roles,
  }).validate(body, { abortEarly: false });
};

exports.validateUpdateUser = (body) => {
  return Joi.object({
    id: objectId,
    firstName: name,
    lastName: name,
    roles,
  }).validate(body, { abortEarly: false });
};
