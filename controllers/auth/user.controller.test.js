const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const User = require('../../models/user');
const { faker } = require('@faker-js/faker');
const { createAccessToken } = require('../../utils/tokens');

const token = createAccessToken();
let usersData;
const usersCount = 2;
const mongoose = require('mongoose');
const user = require('../../models/user');

beforeEach(() => {
  usersData = [];
  for (let i = 0; i < usersCount; i++) {
    usersData.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: '12345678',
    });
  }
});

describe('GET /api/user', () => {
  const apiUser = '/api/user';

  it('should return users', async () => {
    const users = await User.insertMany(usersData);
    const response = await request(app)
      .get(apiUser)
      .set('Authorization', `Bearer ${token}`);

    const filterUsers = response.body.filter(
      (user) => user._id === users[0].id || user._id === users[1].id
    );

    expect(response.status).toBe(200);
    expect(filterUsers.length).toBe(usersCount);

    await User.deleteMany();
  });
});

describe('GET /api/user/:id', () => {
  const apiLogin = '/api/user/123';

  it('should return 400 if id is not valid', async () => {
    const response = await request(app)
      .get(apiLogin)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should return 404 if user not found', async () => {
    const id = mongoose.Types.ObjectId();
    const apiLogin = `/api/user/${id}`;

    const response = await request(app)
      .get(apiLogin)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should return user', async () => {
    const user = await User.create(usersData[0]);
    const apiLogin = `/api/user/${user.id}`;

    const response = await request(app)
      .get(apiLogin)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(user.id);

    await user.remove();
  });
});

// TODO: need to write more tests
describe('POST /api/user', () => {
  const apiLogin = '/api/user';

  it('Should create a user', async () => {
    const response = await request(app)
      .post(apiLogin)
      .send(usersData[0])
      .set('Authorization', `Bearer ${token}`);

    const user = await User.findById(response.body.id);
    expect(user.id).toBeTruthy();

    await user.remove();
  });
});

describe('PUT /api/user', () => {
  const apiLogin = '/api/user';

  it('Should update a user', async () => {
    const user = await User.create(usersData[0]);

    await request(app)
      .put(apiLogin)
      .send({
        id: user.id,
        firstName: 'guy',
        lastName: 'cohen',
      })
      .set('Authorization', `Bearer ${token}`);

    const updatedUser = await User.findById(user.id);

    expect(updatedUser.firstName).toBe('guy');
    expect(updatedUser.lastName).toBe('cohen');

    await updatedUser.remove();
  });
});

describe('DELETE /api/user/:id', () => {
  const apiLogin = '/api/user';

  it('Should delete a user', async () => {
    const user = await User.create(usersData[0]);

    await request(app)
      .delete(apiLogin)
      .send({
        id: user.id,
      })
      .set('Authorization', `Bearer ${token}`);

    const deletedUser = await User.findById(user.id);

    expect(deletedUser).toBeFalsy();
  });
});
