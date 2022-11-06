const config = require('config');
const mongoose = require('mongoose');

module.exports = () => {
  beforeAll(async () => {
    const conn = await mongoose.connect(config.get('db'));
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await mongoose.connection.dropDatabase();
  });
};
