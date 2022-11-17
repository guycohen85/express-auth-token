const mongoose = require('mongoose');
const Joi = require('joi');
const {
  createUserAccessToken,
  createRefreshToken,
} = require('../utils/tokens');

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
  refreshToken: [String],
});

const loginJoiSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(3).max(30).required(),
});

// * Static Methods
UserSchema.statics.validateLogin = (body) => {
  return loginJoiSchema.validate(body, { abortEarly: false });
};

UserSchema.statics.validateRegistration = (body) => {
  const registrationJoiSchema = loginJoiSchema.keys({
    firstName: Joi.string().alphanum().min(2).max(30).required(),
    lastName: Joi.string().alphanum().min(2).max(30).required(),
  });
  return registrationJoiSchema.validate(body, { abortEarly: false });
};

UserSchema.statics.register = async function ({
  firstName,
  lastName,
  email,
  password,
}) {
  const hashPassword = await bcrypt.hash(password, 10);
  const user = new this({ firstName, lastName, email, password: hashPassword });
  const accessToken = createUserAccessToken(user);
  const refreshToken = createRefreshToken();

  user.refreshToken.push(refreshToken);

  return { user, accessToken };
};

// * Methods
UserSchema.methods.login = async function () {
  const refreshToken = createRefreshToken();
  const accessToken = createUserAccessToken(this);

  this.refreshToken.push(refreshToken);
  await this.save();

  return { accessToken, refreshToken };
};

module.exports = mongoose.model('User', UserSchema);
