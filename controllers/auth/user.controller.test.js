const request = require('supertest');
const app = require('../../app');
require('../../utils/tests/dbConnection')();
const User = require('../../models/user');
const { faker } = require('@faker-js/faker');
const { createAccessToken } = require('../../utils/tokens');

const token = createAccessToken({ roles: ['admin'] });
let usersData;
const usersCount = 2;
const mongoose = require('mongoose');
// const user = require('../../models/user');

beforeEach(() => {
  usersData = [];
  for (let i = 0; i < usersCount; i++) {
    usersData.push({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      password: '12345678',
    });
    if (i === 0) {
      usersData[i].roles = ['admin'];
    }
  }
});

describe('GET /api/user', () => {
  const apiUser = '/api/user';

  it('should return users', async () => {
    const users = await User.insertMany(usersData);
    const response = await request(app).get(apiUser).set('Authorization', `Bearer ${token}`);

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
    const response = await request(app).get(apiLogin).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  it('should return 404 if user not found', async () => {
    const id = mongoose.Types.ObjectId();
    const apiLogin = `/api/user/${id}`;

    const response = await request(app).get(apiLogin).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });

  it('should return user', async () => {
    const user = await User.create(usersData[0]);
    const apiLogin = `/api/user/${user.id}`;

    const response = await request(app).get(apiLogin).set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(user.id);

    await user.remove();
  });
});

describe('POST /api/user', () => {
  const apiLogin = '/api/user';

  it('Should create a user', async () => {
    const response = await request(app)
      .post(apiLogin)
      .send(usersData[0])
      .set('Authorization', `Bearer ${token}`);
    const user = await User.findById(response.body._id);
    expect(user._id).toBeTruthy();
    await user.remove();
  });
});

describe('PUT /api/user', () => {
  const apiLogin = '/api/user';

  it('Should update a user', async () => {
    const user = await User.create(usersData[0]);
    const token = createAccessToken(user.toObject());

    await request(app)
      .put(`${apiLogin}/${user.id}`)
      .send({
        firstName: 'guy',
        lastName: 'cohen',
      })
      .set('Authorization', `Bearer ${token}`);

    const updatedUser = await User.findById(user.id);

    expect(updatedUser.firstName).toBe('guy');
    expect(updatedUser.lastName).toBe('cohen');

    await updatedUser.remove();
  });

  it('Should add admin role to a user', async () => {
    const admin = await User.create(usersData[0]);
    const adminToken = createAccessToken(admin.toObject());

    const user = await User.create(usersData[1]);

    const response = await request(app)
      .put(`${apiLogin}/${user.id}`)
      .send({
        firstName: 'guy',
        lastName: 'cohen',
        roles: ['admin'],
      })
      .set('Authorization', `Bearer ${adminToken}`);

    const updatedUser = await User.findById(user.id);

    expect(updatedUser.firstName).toBe('guy');
    expect(updatedUser.lastName).toBe('cohen');

    await admin.remove();
    await updatedUser.remove();
  });
});

describe('DELETE /api/user/:id', () => {
  const apiLogin = '/api/user';

  it('Should delete a user', async () => {
    const user = await User.create(usersData[0]);

    await request(app)
      .delete(`${apiLogin}/${user.id}`)
      .send({
        id: user.id,
      })
      .set('Authorization', `Bearer ${token}`);

    const deletedUser = await User.findById(user.id);

    expect(deletedUser).toBeFalsy();
  });
});
