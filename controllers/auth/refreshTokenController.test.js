const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const { faker } = require('@faker-js/faker');

const token = jwt.sign({}, 'secret');
let reqBody = {};
const email = faker.internet.email();

beforeEach(() => {
  reqBody = {
    refreshToken: token,
  };
  userData = {
    username: 'guy',
    email,
    password: '12345678',
    refreshToken: token,
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
    const user = await User.create(userData);
    const refreshTokenNotExists = jwt.sign({ token: 'not exists' }, 'secret');
    const response = await request(app)
      .post(apiRefreshToken)
      .set('Authorization', `bearer ${refreshTokenNotExists}`)
      .send({ id: user.id });

    expect(response.status).toBe(400);

    await user.remove();
  });

  it('should return a new refresh-token and access-token', async () => {
    const user = await User.create(userData);
    const response = await request(app)
      .post(apiRefreshToken)
      .set('Authorization', `bearer ${token}`)
      .send({ id: user.id });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body.refreshToken).not.toBe(token);

    await user.remove();
  });
});
