const config = require('config');
const mongoose = require('mongoose');

module.exports = async () => {
  await mongoose.connect(config.get('db'));
};

// TODO: if mongodb server or connection is not working return error
