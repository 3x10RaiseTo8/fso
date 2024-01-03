const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

// Loading the database with test blogs
beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.testBlogs);

  // for (let blog of helper.testBlogs) {
  //   let blogObj = new Blog(blog);
  //   await blogObj.save();
  // }

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

test('url missing', async () => {
  const newBlog = {
    author: 'Anon',
    title: 'Reject this',
    likes: 2343,
  };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('title missing', async () => {
  const newBlog = {
    author: 'Anon',
    url: 'anon.blog.com/opp',
    likes: 2,
  };
  await api.post('/api/blogs').send(newBlog).expect(400);
});

test('delete a blog', async () => {
  const initialBlogs = await helper.blogsInDb();
  const idToDelete = initialBlogs[0].id;

  await api.delete(`/api/blogs/${idToDelete}`).expect(204);
  const response = await api.get('/api/blogs');
  expect(response.body.length).toBe(initialBlogs.length - 1);
});

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

// Closing the mongoose connection
afterAll(async () => {
  await mongoose.connection.close();
});
