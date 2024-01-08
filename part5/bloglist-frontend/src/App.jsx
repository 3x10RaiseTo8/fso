import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await loginService.login({ username, password });
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

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  return (
    <div>
      {errorMessage && (
        <Notification message={errorMessage} className="error" />
      )}
      {successMessage && (
        <Notification message={successMessage} className="success" />
      )}
      {!user && (
        <LoginForm
          username={username}
          password={password}
          handleLogin={handleLogin}
          handleUsernameChange={handleUsernameChange}
          handlePasswordChange={handlePasswordChange}
        />
      )}
      {user && <h3>{user.name} is logged in.</h3>}
      <h2>Blogs</h2>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
