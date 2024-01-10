import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';
import Togglable from './components/Togglable';

const App = () => {
  // States
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Refs
  const noteFormRef = useRef();

  // Event Handlers
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
      const newBlogs = await blogService.getAll();
      setBlogs(newBlogs);
      noteFormRef.current.toggleVisibility();
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

  // Effects
  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(blogs);
    });
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser');
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      setUser(loggedUser);
      blogService.setToken(loggedUser.token);
    }
  }, []);

  // Render the components
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

      <h1>Blogs</h1>

      {user && (
        <div>
          {user.name} is logged in
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <hr />

      <Togglable buttonLabel="Create New Blog" ref={noteFormRef}>
        <BlogForm createBlog={createBlog} />
      </Togglable>

      <hr />

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
