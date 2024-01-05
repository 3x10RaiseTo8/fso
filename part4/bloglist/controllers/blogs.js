const blogsRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const { title, author, url, likes = 0 } = request.body;

  const users = await User.find({});
  const id = users[0].id;
  const user = await User.findById(id);

  const blogObject = new Blog({
    title,
    author,
    url,
    likes,
    user: user.id,
  });

  const savedBlog = await blogObject.save();
  user.blogs.concat(savedBlog._id);
  await user.save();

  response.status(201).json(savedBlog);
});

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', {
    name: 1,
    username: 1,
  });
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
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
