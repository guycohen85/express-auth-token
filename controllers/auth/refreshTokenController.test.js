const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

let reqBody = {};
let token;

beforeEach(async () => {
  const id = mongoose.Types.ObjectId();
  token = jwt.sign({ id }, 'secret');
  const hashRefreshToken = await bcrypt.hash(token, 10);
  const email = faker.internet.email();

  reqBody = {
    refreshToken: token,
  };
  userData = {
    _id: id,
    firstName: 'guy',
    lastName: 'cohen',
    email,
    password: '12345678',
    refreshToken: [hashRefreshToken],
  };
});

describe('POST /api/refresh-token', () => {
  const apiRefreshToken = '/api/refresh-token';

  it('should return 400 if refresh-token is not valid', async () => {
    reqBody.refreshToken = '123';
    const response = await request(app).post(apiRefreshToken).send(reqBody);

    expect(response.status).toBe(400);
  });

  it('should return 400 if refresh-token is valid and not exists in the database', async () => {
    userData.refreshToken = [];
    const user = await User.create(userData);
    const response = await request(app)
      .post(apiRefreshToken)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);

    await user.remove();
  });

  it('should return 400 if refresh-token id is not mongoose valid id', async () => {
    const token = jwt.sign({ id: '123' }, 'secret');

    // userData.refreshToken = [];
    // const user = await User.create(userData);
    const response = await request(app)
      .post(apiRefreshToken)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(400);

    // await user.remove();
  });

  it('should return a new refresh-token and access-token', async () => {
    const user = await User.create(userData);
    const response = await request(app)
      .post(apiRefreshToken)
      .set('Authorization', `bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    // expect(response.body).toHaveProperty('refreshToken');
    expect(response.body.refreshToken).not.toBe(token);

    await user.remove();
  });
});
