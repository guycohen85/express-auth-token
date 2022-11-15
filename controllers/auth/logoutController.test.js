const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const User = require('../../models/user');
const { faker } = require('@faker-js/faker');

let userData = {};

beforeEach(() => {
  userData = {
    firstName: 'guy',
    lastName: 'cohen',
    email: 'guycohen85@gmail.com',
    password: '12345678',
    refreshToken: ['12345678'],
  };
});

describe('POST /api/logout', () => {
  const apiLogout = '/api/logout';

  it('should return 400 if id is not a valid id', async () => {
    const user = await User.create(userData);
    const response = await request(app).post(apiLogout).send({ id: '1' });

    expect(response.status).toBe(400);

    await user.remove();
  });

  it('should logout', async () => {
    const { id } = await User.create(userData);
    const response = await request(app).post(apiLogout).send({ id });
    const user = await User.findById(id);

    expect(response.status).toBe(200);
    expect(user.refreshToken).toHaveLength(0);

    await user.remove();
  });
});
