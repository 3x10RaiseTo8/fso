import { useState } from 'react';

const Blog = ({ blog, handleLike }) => {
  const [view, setView] = useState(false);

  const label = view ? 'Hide' : 'Show';

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <p>
        {blog.title} - {blog.author}{' '}
        <button onClick={() => setView(!view)}>{label}</button>
      </p>
      {view && (
        <div>
          <p>
            <a href={blog.url}>{blog.url}</a>
          </p>
          <p>
            Likes {blog.likes} <button onClick={handleLike}>Like</button>
          </p>
          <p>Added by {blog.user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
