const createError = require('http-errors');
const User = require('../models/user');
const Joi = require('joi');
const { objectId, name } = require('../utils/joiValidations');
const bcrypt = require('bcrypt');

exports.findAll = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

exports.findOne = async (req, res, next) => {
  const schema = Joi.object({ id: objectId });
  const {
    error,
    value: { id },
  } = schema.validate({ id: req.params.id });

  if (error) return next(createError(400, error));

  const user = await User.findById(req.params.id).select('_id firstName lastName email');

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  res.json(user);
};

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
  user;
  res.json({ _id: user._id, firstName, lastName, email });
};

exports.update = async (req, res, next) => {
  //validate
  const schema = Joi.object({
    id: objectId,
    firstName: name,
    lastName: name,
  });

  const { error, value } = schema.validate({ ...req.body, id: req.params.id });

  if (error) return next(createError(400, error));

  //find user
  const { id, firstName, lastName } = value;

  const user = await User.findById(id).select('_id firstName lastName email');

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  //update
  user.firstName = firstName;
  user.lastName = lastName;

  await user.save();

  res.json(user);
};

exports.delete = async (req, res, next) => {
  //validate
  const schema = Joi.object({
    id: objectId,
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

  res.json({ _id: id });
};

// Todo: https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/
