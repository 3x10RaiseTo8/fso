import { useState } from 'react';

const Blog = ({ blog, addLike }) => {
  const { title, url, author, likes, user, id } = blog;

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const [view, setView] = useState(false);
  const label = view ? 'Hide' : 'Show';

  const handleLike = () => {
    addLike({ title, url, author, likes: likes + 1 }, id);
  };

  return (
    <div style={blogStyle}>
      <p>
        {title} - {author}{' '}
        <button onClick={() => setView(!view)}>{label}</button>
      </p>
      {view && (
        <div>
          <p>
            <a href={url}>{url}</a>
          </p>
          <p>
            Likes {likes} <button onClick={handleLike}>Like</button>
          </p>
          <p>Added by {user.name}</p>
        </div>
      )}
    </div>
  );
};

export default Blog;
