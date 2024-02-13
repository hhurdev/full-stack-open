const Blog = require('../models/blogs')
const User = require('../models/user')
const blogsRouter = require('express').Router()
require('express-async-errors')

blogsRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = blogsRouter