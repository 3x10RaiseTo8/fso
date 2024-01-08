const BlogForm = ({
  handleCreate,
  handleAuthorChange,
  handleTitleChange,
  handleUrlChange,
  title,
  url,
  author,
}) => {
  return (
    <div>
      <h2>Create a new Blog</h2>

      <form onSubmit={handleCreate}>
        <div>
          Title
          <input
            type="text"
            name="Title"
            value={title}
            onChange={handleTitleChange}
          />
        </div>
        <div>
          Author
          <input
            type="text"
            name="Author"
            value={author}
            onChange={handleAuthorChange}
          />
        </div>
        <div>
          URL
          <input
            type="text"
            name="URL"
            value={url}
            onChange={handleUrlChange}
          />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default BlogForm;
