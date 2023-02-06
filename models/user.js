const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { createAccessToken, createRefreshToken } = require('../utils/tokens');

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  roles: [String],
  refreshToken: [String],
});

// * Static Methods
UserSchema.statics.register = async function ({ firstName, lastName, email, password }) {
  const hashPassword = await bcrypt.hash(password, 10);

  const user = new this({
    firstName,
    lastName,
    email,
    password: hashPassword,
  });

  const refreshToken = createRefreshToken(user.id);
  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken = [hashRefreshToken];

  const accessToken = createAccessToken(user.toObject());

  return { user, accessToken, refreshToken };
};

// * Methods
UserSchema.methods.login = async function () {
  const refreshToken = createRefreshToken(this.id);
  const hashRefreshToken = await bcrypt.hash(refreshToken, 10);
  const accessToken = createAccessToken(this.toObject());

  this.refreshToken.push(hashRefreshToken);
  await this.save();

  return { accessToken, refreshToken };
};

// * Transforms
if (!UserSchema.options.toObject) UserSchema.options.toObject = {};
UserSchema.options.toObject.transform = function (doc, ret, options) {
  delete ret.__v;
  delete ret.password;
  delete ret.refreshToken;
  return ret;
};

module.exports = mongoose.model('User', UserSchema);
