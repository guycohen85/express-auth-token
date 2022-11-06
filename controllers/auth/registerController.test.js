const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const User = require('../../models/user');

let reqBody = {};

beforeEach(() => {
  reqBody = {
    username: 'guy',
    email: 'guycohen85@gmail.com',
    password: '12345678',
    repeatPassword: '12345678',
  };
});

describe('POST /register', () => {
  const apiPath = '/register';

  it('should return 400 if validation failed', async () => {
    reqBody.email = 'Invalid email';
    const response = await request(app).post(apiPath).send(reqBody);
    expect(response.status).toBe(400);
  });

  it('should return 400 if user already exists', async () => {
    await User.create(reqBody);
    const response = await request(app).post(apiPath).send(reqBody);
    expect(response.status).toBe(400);
  });

  it('should save a user to the database', async () => {
    const response = await request(app).post(apiPath).send(reqBody);
    expect(response.status).toBe(200);
    const user = await User.findOne({ email: reqBody.email });
    expect(user).not.toBeNull();
  });

  it('should return 200 with user payload', async () => {
    const response = await request(app).post(apiPath).send(reqBody);
    expect(response.status).toBe(200);
    expect(Object.keys(response.body).length).toBeTruthy();
  });
});
