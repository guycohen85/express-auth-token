const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const { faker } = require('@faker-js/faker');

let reqBody = {};
let userData = {};
const email = faker.internet.email();

beforeEach(() => {
  reqBody = {
    email,
    password: '12345678',
  };
  userData = {
    firstName: 'guy',
    lastName: 'cohen',
    email,
    password: '12345678',
  };
});

describe('POST /api/login', () => {
  const apiLogin = '/api/login';

  it('should return 400 if login validation failed', async () => {
    reqBody.email = 'Invalid email';
    const response = await request(app).post(apiLogin).send(reqBody);

    expect(response.status).toBe(400);
  });

  it('should return 401 if user not exists', async () => {
    const response = await request(app).post(apiLogin).send(reqBody);

    expect(response.status).toBe(401);
  });

  it('should return 401 if wrong password', async () => {
    const user = await User.create(userData);
    userData.password = 'wrong password';
    const response = await request(app).post(apiLogin).send(reqBody);

    expect(response.status).toBe(401);

    await user.remove();
  });

  it('should login', async () => {
    const hashPassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashPassword;

    const user = await User.create(userData);
    const response = await request(app).post(apiLogin).send(reqBody);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');

    await user.remove();
  });
});
