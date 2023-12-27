const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

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

afterAll(async () => {
  await mongoose.connection.close();
});
