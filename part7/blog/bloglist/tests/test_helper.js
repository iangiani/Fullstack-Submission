const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'YangYue',
    author: 'Pinkray',
    url: 'http://blog.com/1',
    likes: 11,
  },
  {
    title: 'YueYang',
    author: 'Kwin',
    url: 'http://blog.com/2',
    likes: 22,
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const loginToken = async (api, { username, password }) => {
  const result = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)

  return result.body.token
}

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'willremovethissoon',
    author: 'temp',
    url: 'http://temp.com',
    likes: 0,
  })

  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

module.exports = {
  initialBlogs, blogsInDb, usersInDb, loginToken, nonExistingId
}