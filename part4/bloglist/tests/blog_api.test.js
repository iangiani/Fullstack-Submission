const assert = require('node:assert')
const { test, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })
  const savedUser = await user.save()

  const response = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })
    .expect(200)

  token = response.body.token
  const blogObjects = helper.initialBlogs.map(
    b => new Blog({ ...b, user: savedUser._id })
  )
  const promise = blogObjects.map(blog => blog.save())
  await Promise.all(promise)
})

test('returns the correct amount of blog posts in the JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('the unique identifier property of the blog posts is id', async () => {
  const response = await api.get('/api/blogs')
  const blog = response.body[0]

  assert.notStrictEqual(blog.id, undefined)
  assert.strictEqual(blog._id, undefined)
})

test('creates a new blog post with valid token', async () => {
  const newblog = {
    title: 'New blog',
    author: 'Yuehui',
    url: 'http://blog.com/3',
    likes: 21
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
  const titles = blogsAtEnd.map(b => b.title)
  assert.ok(titles.includes('New blog'))
})

test('if the likes property is missing, it will be 0', async () => {
  const missingblog = {
    title: 'No likes',
    author: 'YUU',
    url: 'http://blog.com/4'
  }

  const result = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(missingblog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.likes, 0)
})

test('if title property is missing, returns 400 Bad Request', async () => {
  const titleblog = {
    author: 'Yangyang',
    url: 'http://blog.com/5',
    likes: 99
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(titleblog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('if url property is missing, returns 400 Bad Request', async () => {
  const urlblog = {
    title: 'MZYYY',
    author: 'Bao',
    likes: 12
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(urlblog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('delete a single blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  const ids = blogsAtEnd.map(b => b.id)
  assert(!ids.includes(blogToDelete.id))
  assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('update the information of an individual blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  let updatedLikes = 0
  if (blogToUpdate.likes) {
    updatedLikes = blogToUpdate.likes + 5
  } else {
    updatedLikes = 5
  }

  const resultBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: updatedLikes })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(resultBlog.body.likes, updatedLikes)
  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
  assert.strictEqual(updatedBlog.likes, updatedLikes)
})

test('creates a new blog if token is not provided', async () => {
  const newblog = {
    title: 'New blog without token',
    author: 'Zhengyang',
    url: 'http://blog.com/ivt',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .send(newblog)
    .expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

after(async () => {
  await mongoose.connection.close()
})
