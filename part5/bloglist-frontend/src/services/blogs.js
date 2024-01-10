import axios from 'axios';
const baseUrl = 'http://localhost:3003/api/blogs';

let config = {
  headers: {
    Authorization: null,
  },
};

const setToken = (newToken) => {
  config.headers.Authorization = `Bearer ${newToken}`;
};

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createBlog = async (newBlogObject) => {
  const response = await axios.post(baseUrl, newBlogObject, config);
  return response.data;
};

const updateBlog = async (newBlogObject, blogId) => {
  const response = await axios.put(
    `${baseUrl}/${blogId}`,
    newBlogObject,
    config
  );
  return response.data;
};

const deleteBlog = async (blogId) => {
  const response = await axios.delete(`${baseUrl}/${blogId}`, config);
  return response.data;
};

export default { getAll, createBlog, updateBlog, deleteBlog, setToken };
