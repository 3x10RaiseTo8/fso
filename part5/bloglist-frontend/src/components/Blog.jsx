import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, loggedUser, addLike, removeBlog }) => {
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
  const isOwner = loggedUser.username === user.username ? true : false;

  const handleLike = () => {
    addLike({ title, url, author, likes: likes + 1 }, id);
  };

  const handleDelete = () => removeBlog(blog);

  return (
    <div style={blogStyle} className="singleBlog">
      <p className="visibleContent">
        {title} - {author}{' '}
        <button onClick={() => setView(!view)}>{label}</button>
      </p>
      {view && (
        <div className="hiddenContent">
          <p>
            <a href={url}>{url}</a>
          </p>
          <p>
            Likes {likes}{' '}
            <button className="likeButton" onClick={handleLike}>
              Like
            </button>
          </p>
          <p>
            Added by {user.name}{' '}
            {isOwner && (
              <button onClick={handleDelete} className="deleteButton">
                Delete
              </button>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  loggedUser: PropTypes.object.isRequired,
  addLike: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
};

export default Blog;
