const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

// Loading the database with test blogs
beforeEach(async () => {
  await Blog.deleteMany({});

  for (let blog of helper.testBlogs) {
    let blogObj = new Blog(blog);
    await blogObj.save();
  }

  // const blogObjects = helper.testBlogs.map((blog) => new Blog(blog));
  // const promiseArray = blogObjects.map((blog) => blog.save());
  // Promise.all(promiseArray);
});

// Tests starts from here
test('All blogs are returned as JSON', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
  expect(response.body.length).toBe(helper.testBlogs.length);
});

test('id is not _id', async () => {
  const response = await api.get('/api/blogs');
  const blog = response.body[0];
  expect(blog.id).toBeDefined();
  expect(blog._id).not.toBeDefined();
  expect(blog.__v).not.toBeDefined();
});

test('post a new blog', async () => {
  const newBlog = {
    title: 'Fake blog',
    author: 'Fake author',
    url: 'fake.blog.com/opp',
    likes: 0,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const response = await api.get('/api/blogs');
  expect(response.body).toHaveLength(helper.testBlogs.length + 1);

  const titles = response.body.map((blog) => blog.title);
  expect(titles).toContain('Fake blog');
});

test('likes value defaults to 0 if not provided in req', async () => {
  const newBlog = {
    title: 'Like 0',
    author: 'z',
    url: 'zerolike.blog.com/opp',
  };
  const response = await api.post('/api/blogs').send(newBlog);
  expect(response.body.likes).toBe(0);
});

// Closing the mongoose connection
afterAll(async () => {
  await mongoose.connection.close();
});
