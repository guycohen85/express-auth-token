const createError = require('http-errors');
const User = require('../models/user');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const { validateObjectId } = require('../validations/objectId');
const { validateCreateUser, validateUpdateUser } = require('../validations/user');
const { isAdmin } = require('../utils/auth');

exports.findAll = async (req, res) => {
  const users = await User.find({}, '-password -refreshToken');
  res.json(users);
};

exports.findOne = async (req, res, next) => {
  const {
    error,
    value: { id },
  } = validateObjectId(req.params.id);

  if (error) return next(createError(400, error));

  const user = await User.findById(id);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  res.json(user.toObject());
};

exports.create = async (req, res, next) => {
  const { error, value } = validateCreateUser(req.body);

  if (error) {
    return next(createError(400, error));
  }

  const userExist = await User.findOne({ email: req.body.email });

  if (userExist) return next(createError(400, 'user already exists'));

  const { firstName, lastName, email, password, roles } = value;

  const hashPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName,
    lastName,
    email,
    password: hashPassword,
    roles,
  });

  await user.save();

  res.json(user.toObject());
};

exports.update = async (req, res, next) => {
  // if user.id !== req.params.id && !user.isAdmin() -> return error(only admin can update another user)

  //validate
  const { error, value } = validateUpdateUser({ ...req.body, id: req.params.id });

  if (error) return next(createError(400, error));

  //find user
  const { id, firstName, lastName, roles } = value;

  const user = await User.findById(id);

  if (!user) {
    return next(createError(404, 'User not found'));
  }

  //update
  if (roles !== undefined) {
    if (isAdmin(req)) {
      user.roles = roles;
    } else {
      return next(createError(403, 'Only admin user can set roles'));
    }
  }

  user.firstName = firstName;
  user.lastName = lastName;

  await user.save();

  res.json(user.toObject());
};

exports.delete = async (req, res, next) => {
  //validate
  const { error, value } = validateObjectId(req.params.id);

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
