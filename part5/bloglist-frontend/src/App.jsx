import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()

  useEffect(() => {
    const Blogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort((a, b) => b.likes - a.likes))
    }
    Blogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const informNotification = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(user)
      )
      setUser(user)
      setUsername('')
      setPassword('')
      blogService.setToken(user.token)
      informNotification('login successful', 'success')
    } catch {
      informNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    blogService.setToken(null)
  }

  const handleCreate = async blogObject => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(
        blogs.concat(createdBlog).sort((a, b) => b.likes - a.likes)
      )
      informNotification(
        `a new blog ${createdBlog.title} by ${createdBlog.author} added`,
        'success'
      )
      blogFormRef.current.toggleVisibility()
    } catch {
      informNotification('blog creation failed', 'error')
    }
  }

  const handleLike = async blog => {
    if (!blog)
      return

    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id || blog.user
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs((Blogs) =>
        Blogs
          .map((b) => (b.id === blog.id ? { ...b, likes: returnedBlog.likes } : b))
          .sort((a, b) => b.likes - a.likes)
      )
    } catch (error) {
      console.error('Like failed:', error)
    }
  }

  const handleRemove = async blog => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`))
      return

    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
      informNotification(`Deleted: ${blog.title}`, 'success')
    } catch {
      informNotification('blog remove failed', 'error')
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={notification} />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id="username"
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id="login-button" type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />

      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>

      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={handleCreate} />
      </Togglable>

      {blogs
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={handleLike}
            onRemove={handleRemove}
            currentUser={user}
          />
        ))}
    </div>
  )
}

export default App