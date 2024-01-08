import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleAuthorChange = (e) => setAuthor(e.target.value);
  const handleUrlChange = (e) => setUrl(e.target.value);

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser');
    setUser(null);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login({ username, password });
      window.localStorage.setItem('loggedInUser', JSON.stringify(response));
      blogService.setToken(response.token);
      setUser(response);
      setUsername('');
      setPassword('');
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

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await blogService.createBlog({ title, author, url });
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
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
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

      <BlogForm
        author={author}
        title={title}
        url={url}
        handleAuthorChange={handleAuthorChange}
        handleTitleChange={handleTitleChange}
        handleUrlChange={handleUrlChange}
        handleCreate={handleCreate}
      />
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
