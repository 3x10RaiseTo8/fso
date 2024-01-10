import { useState } from 'react';

const Blog = ({ blog, handleLike }) => {
  const [view, setView] = useState(false);

  const label = view ? 'Hide' : 'Show';

  const handleView = () => {
    console.log(view, label);
    setView(!view);
  };

  return (
    <div>
      <p>
        {blog.title} - {blog.author}{' '}
        <button onClick={handleView}>{label}</button>
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
