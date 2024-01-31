import { useState } from 'react';
import PropTypes from 'prop-types';

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    await createBlog({ title, author, url });
    setTitle('');
    setAuthor('');
    setUrl('');
  };

  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={handleCreate} className="blogForm">
        <div>
          Title
          <input
            type="text"
            name="Title"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          Author
          <input
            type="text"
            name="Author"
            value={author}
            placeholder="Author"
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <div>
          URL
          <input
            type="text"
            name="URL"
            value={url}
            placeholder="URL"
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button type="submit" className="createButton">
          Create
        </button>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};

export default BlogForm;
