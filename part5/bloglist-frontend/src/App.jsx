import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const sendLogin = async (credentials) => {
    try {
      const response = await loginService.login(credentials);
      window.localStorage.setItem('loggedInUser', JSON.stringify(response));
      blogService.setToken(response.token);
      setUser(response);
      setSuccessMessage(`Welcome, ${response.name}!`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (exception) {
      console.log(exception);
      setErrorMessage('Wrong credentials');
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
      console.log('Wrong credentials');
    }
  };

  const createBlog = async (blogObject) => {
    try {
      const response = await blogService.createBlog(blogObject);
      setBlogs(blogs.concat(response));
      setSuccessMessage(
        `A new blog "${response.title}" by "${
          response.author || 'Unknown'
        }" has been created`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (exception) {
      setErrorMessage(exception.response.data.error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }
  };

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  if (!user) {
    return (
      <div>
        {errorMessage && (
          <Notification message={errorMessage} className="error" />
        )}
        <LoginForm sendLogin={sendLogin} />
      </div>
    );
  }
  return (
    <div>
      {errorMessage && (
        <Notification message={errorMessage} className="error" />
      )}
      {successMessage && (
        <Notification message={successMessage} className="success" />
      )}

      <BlogForm createBlog={createBlog} />
      <h2>Blogs</h2>
      {user && (
        <div>
          {user.name} is logged in
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
      <hr></hr>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
