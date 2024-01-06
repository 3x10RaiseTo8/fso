const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

let token;

// Loading the database with test blogs
beforeEach(async () => {
  const testUser = await helper.deleteAllAndCreateTestUser();
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'test0', password: 'testpassword' });
  token = `Bearer ${loginResponse.body.token}`;

  await Blog.deleteMany({});

  for (let blog of helper.testBlogs) {
    let blogObj = new Blog({ ...blog, user: testUser.id });
    await blogObj.save();
  }

  // const blogObjects = helper.testBlogs.map((blog) => new Blog({ ...blog, user: testuser.id }));
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // Promise.all(promiseArray);
}, 10000);

// Tests starts from here
describe('get', () => {
  test('All blogs are returned as JSON', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    expect(response.body.length).toBe(helper.testBlogs.length);
  });

  test('id is formatted correctly', async () => {
    const response = await api.get('/api/blogs');
    const blog = response.body[0];
    expect(blog.id).toBeDefined();
    expect(blog._id).not.toBeDefined();
    expect(blog.__v).not.toBeDefined();
  });
});

describe('delete', () => {
  test('delete a blog', async () => {
    const initialBlogs = await helper.blogsInDb();
    const idToDelete = initialBlogs[0].id;

    await api
      .delete(`/api/blogs/${idToDelete}`)
      .set('Authorization', token)
      .expect(204);
    const response = await api.get('/api/blogs');
    expect(response.body.length).toBe(initialBlogs.length - 1);
  });
});

describe('update', () => {
  test('Update a blog', async () => {
    const initialBlogs = await helper.blogsInDb();
    const idToUpdate = initialBlogs[1].id;

    const blogUpdate = {
      author: 'New author',
      title: 'Test is successful',
      url: 'test.blog.com/success',
      likes: 988999,
    };
    await api.put(`/api/blogs/${idToUpdate}`).send(blogUpdate).expect(200);
    const response = await api.get(`/api/blogs/${idToUpdate}`);
    expect(response.body.title).toBe('Test is successful');
  });
});

describe('post', () => {
  const newBlog = {
    title: 'Fake blog',
    author: 'Fake author',
    url: 'fake.blog.com/opp',
    likes: 2323,
  };
  test('if token is not provided', async () => {});

  test('post a new blog', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', token)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const response = await api.get('/api/blogs');
    expect(response.body).toHaveLength(helper.testBlogs.length + 1);

    const titles = response.body.map((blog) => blog.title);
    expect(titles).toContain('Fake blog');
  });

  test('post likes value defaults to 0 if not provided in req', async () => {
    // eslint-disable-next-line no-unused-vars
    const { likes, ...noLikes } = newBlog;
    const response = await api
      .post('/api/blogs')
      .send(noLikes)
      .set('Authorization', token);
    expect(response.body.likes).toBe(0);
  });

  test('url missing', async () => {
    // eslint-disable-next-line no-unused-vars
    const { url, ...noUrl } = newBlog;
    await api
      .post('/api/blogs')
      .send(noUrl)
      .set('Authorization', token)
      .expect(400);
  });

  test('title missing', async () => {
    // eslint-disable-next-line no-unused-vars
    const { title, ...noTitle } = newBlog;
    await api
      .post('/api/blogs')
      .send(noTitle)
      .set('Authorization', token)
      .expect(400);
  });
});

// Closing the mongoose connection
afterAll(async () => {
  await mongoose.connection.close();
});
