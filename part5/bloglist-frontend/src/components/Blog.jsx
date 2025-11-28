import { useState } from 'react'

const Blog = ({ blog, onLike, onRemove, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = () => {
    onLike(blog)
  }

  const handleRemove = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      onRemove(blog)
    }
  }

  const showWhenVisible = { display: visible ? '' : 'none' }

  const isCreator =
    currentUser &&
    blog.user &&
    (blog.user.username === currentUser.username ||
      blog.user.id === currentUser.id)

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>

      <div className="blogDetails" style={showWhenVisible}>
        <div>{blog.url}</div>
        <div>
          likes{' '}
          <span className="likes-count">{blog.likes}</span>
          <button className="like-button" onClick={handleLike}>
            like
          </button>
        </div>
        <div>{blog.user && blog.user.name}</div>
        {isCreator && (
          <button className="remove-button" onClick={handleRemove}>
            remove
          </button>
        )}
      </div>
    </div>
  )
}

export default Blog