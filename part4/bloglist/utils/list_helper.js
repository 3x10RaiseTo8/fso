const _ = require('lodash');

const dummy = (blogs) => {
  return blogs ? 1 : 0;
};

const totalLikes = (blogs) => {
  return blogs.reduce((total, current) => (total += current.likes), 0);
};

const favoriteBlog = (blogs) => {
  let index = 0,
    hi = 0;
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].likes > hi) {
      hi = blogs[i].likes;
      index = i;
    }
  }
  let { title, author, likes } = blogs[index];
  return { title, author, likes };
};

const mostBlogs = (blogs) => {
  const blogsGroupedByAuthors = _.groupBy(blogs, 'author');
  const blogsCountByAuthors = _.map(blogsGroupedByAuthors, (blogs, author) => {
    return { author, blogs: blogs.length };
  });
  return _.maxBy(blogsCountByAuthors, 'blogs');
};

const mostLikes = (blogs) => {
  const blogsGroupedByAuthors = _.groupBy(blogs, 'author');
  const blogsLikesByAuthors = _.map(blogsGroupedByAuthors, (blogs, author) => {
    return {
      author,
      likes: blogs.reduce((total, current) => (total += current.likes), 0),
    };
  });
  return _.maxBy(blogsLikesByAuthors, 'likes');
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
