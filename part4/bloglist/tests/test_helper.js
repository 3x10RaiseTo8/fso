const Blog = require('../models/blog');

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

module.exports = {
  testBlogs,
  blogsInDb,
  nonExistingId,
};
