require('../utils/tests/dbConnection')();
const User = require('./user');
const { faker } = require('@faker-js/faker');

let userData = {};

beforeEach(() => {
  userData = {
    firstName: 'guy',
    lastName: 'cohen',
    email: faker.internet.email(),
    password: '12345678',
    refreshToken: ['refreshToken1'],
  };
});

describe('User', () => {
  describe('login', () => {
    it('should not delete other tokens when pushing a new refresh token', async () => {
      const user = await User.create(userData);
      await user.login();
      expect(user.refreshToken).toHaveLength(2);
      await user.remove();
    });
  });
});
