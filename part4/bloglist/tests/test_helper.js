const Blog = require('../models/blog');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const testBlogs = [
  {
    title: 'Test blog number 1',
    url: 'test.blog.com/opp',
    author: 'Test demon',
    likes: 243,
  },
  {
    title: 'Better test blog',
    url: 'bettertest.blog.com/opp',
    author: 'Test god',
    likes: 11111111111,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((b) => b.toJSON());
};

const nonExistingId = async () => {
  const dummyBlog = new Blog(testBlogs[0]);
  await dummyBlog.save();
  await dummyBlog.deleteOne();
  return dummyBlog._id.toString();
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const deleteAllAndCreateTestUser = async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('testpassword', 10);
  const user = new User({
    username: 'test0',
    passwordHash,
    name: 'Create Test User',
  });
  const savedUser = await user.save();
  return savedUser;
};

module.exports = {
  testBlogs,
  blogsInDb,
  nonExistingId,
  usersInDb,
  deleteAllAndCreateTestUser,
};
