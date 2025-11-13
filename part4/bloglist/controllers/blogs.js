const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })

  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const { title, author, url, likes } = request.body

    if (!title || !url) {
      return response.status(400).json({ error: 'title and url are required' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes ?? 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response, next) => {
  try {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'cannot delete this blog' })
    }

    await blog.deleteOne()
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) 
      return response.status(404).end()

    blog.likes = request.body.likes
    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
