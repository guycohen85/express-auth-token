const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const User = require('../../models/user');
const { faker } = require('@faker-js/faker');

let reqBody = {};

beforeEach(() => {
  reqBody = {
    username: 'guy',
    email: faker.internet.email(),
    password: '12345678',
    repeatPassword: '12345678',
  };
});

describe('POST /api/register', () => {
  const apiRegister = '/api/register';

  it('should return 400 if registration validation failed', async () => {
    reqBody.email = 'Invalid email';
    const response = await request(app).post(apiRegister).send(reqBody);

    expect(response.status).toBe(400);
  });

  it('should return 400 if user already exists', async () => {
    const user = await User.create(reqBody);
    const response = await request(app).post(apiRegister).send(reqBody);

    expect(response.status).toBe(400);

    await user.remove();
  });

  it('should save a user to the database', async () => {
    const response = await request(app).post(apiRegister).send(reqBody);
    const user = await User.findOne({ email: reqBody.email });

    expect(response.status).toBe(200);
    expect(user).not.toBeNull();

    await user.remove();
  });

  it('should return 200 with user payload', async () => {
    const response = await request(app).post(apiRegister).send(reqBody);

    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBeTruthy();

    await User.deleteOne({ email: reqBody.email });
  });
});
