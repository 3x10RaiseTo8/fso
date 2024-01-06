const blogsRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body;

  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  const user = await User.findById(decodedToken.id);

  const blogObject = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  });

  const savedBlog = await blogObject.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    name: 1,
    username: 1,
  });
  if (!blog) {
    response.status(404).end();
  }
  response.json(blog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  const blog = await Blog.findById(request.params.id);
  const user = await User.findById(decodedToken.id);
  if (blog.user.toString() !== user.id.toString()) {
    return response.status(403).json({ error: 'invalid token' });
  }
  await Blog.findByIdAndDelete(blog.id);
  return response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body;
  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );
  response.json(updatedBlog);
});

module.exports = blogsRouter;
