const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is one user in database', () => {
  beforeEach(async () => {
    await helper.deleteAllAndCreateTestUser();
  });

  test('fresh user is created', async () => {
    const initialUsers = await helper.usersInDb();

    const newUser = {
      username: 'test1',
      name: 'This is test one',
      password: 'lmao',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const finalUsers = await helper.usersInDb();
    expect(finalUsers).toHaveLength(initialUsers.length + 1);

    const usernames = finalUsers.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('username with less than 3 chars', async () => {
    const invalidUser = {
      username: '2c',
      name: 'Invalid User',
      password: 'invalid password',
    };
    const response = await api.post('/api/users').send(invalidUser).expect(400);
    expect(response.body.error).toBeDefined();
  });

  test('password with less than 3 chars', async () => {
    const invalidUser = {
      username: 'valid username',
      name: 'Invalid User',
      password: 'no',
    };
    const response = await api.post('/api/users').send(invalidUser).expect(400);
    expect(response.body.error).toBe(
      'Password must be atleast 3 characters long'
    );
  });
});
