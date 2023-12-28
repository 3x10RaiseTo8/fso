const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body;
  const blogObject = new Blog({
    title,
    author,
    url,
    likes,
  });
  const savedBlog = await blogObject.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
