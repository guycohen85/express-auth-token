const mongoose = require('mongoose');
const Joi = require('joi');
const { getAccessToken, getRefreshToken } = require('../utils/tokens');

const UserSchema = new mongoose.Schema({
  username: {
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

UserSchema.statics.validate = (body) => {
  const schema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(30).required(),
    repeatPassword: Joi.ref('password'),
  });

  return schema.validate(body, { abortEarly: false });
};

UserSchema.statics.createUser = async function ({ username, email, password }) {
  const hashPassword = await bcrypt.hash(password, 10);
  const user = new this({ username, email, password: hashPassword });
  const accessToken = getAccessToken({ id: user.id, username, email });
  const refreshToken = getRefreshToken();

  user.refreshToken.push(refreshToken);

  return { user, accessToken };
};

module.exports = mongoose.model('User', UserSchema);
