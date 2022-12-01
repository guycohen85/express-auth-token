const createError = require('http-errors');
const User = require('../models/user');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcrypt');

exports.findAll = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.findOne = async (req, res, next) => {
  // TODO: extract all validations to util file
  const schema = Joi.object({ id: Joi.objectId() });
  const {
    error,
    value: { id },
  } = schema.validate({ id: req.params.id });

  if (error) return next(createError(400, error));

  const user = await User.findById(req.params.id);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  res.json(user);
};

// Todo: https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/

exports.create = async (req, res, next) => {
  const { error, value } = User.validate(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  const { firstName, lastName, email, password } = value;

  const hashPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  await user.save();

  res.json({ id: user.id, firstName, lastName, email });
};

exports.update = async (req, res, next) => {
  //validate
  const schema = Joi.object({
    id: Joi.objectId(),
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    lastName: Joi.string().alphanum().min(2).max(30).required(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) return next(createError(400, error));

  //find user
  const { id, firstName, lastName } = value;

  const user = await User.findById(id);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  //update
  user.firstName = firstName;
  user.lastName = lastName;

  await user.save();

  res.json({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  });
};

exports.delete = async (req, res, next) => {
  //validate
  const schema = Joi.object({
    id: Joi.objectId(),
  });

  const { error, value } = schema.validate(req.body);

  if (error) return next(createError(400, error));

  //find user
  const { id } = value;

  const user = await User.findById(id);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  //delete
  await user.remove();

  res.json({ id });
};
