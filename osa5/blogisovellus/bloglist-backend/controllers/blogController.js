const Blog = require('../models/blogs')
const User = require('../models/user')
const blogsRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
require('express-async-errors')

blogsRouter.post('/reset', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs) /** express uses JSON.stringify to convert. This in turn internally
  calls the .toJSON() method on each blog document (mitä on muokattu)
  This is a feature of JavaScript where if an object has a .toJSON() method,
  JSON.stringify() will automatically call it. Mongoose hyödyntää sitä ominaisuutta
       */
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  // pyynnössä tosiaan blogi ja headerissa token, jonka avulla
  // voidaan tunnistaa käyttäjä (userExtractor hoitaa tämän)
  const body = request.body
  const user = request.user

  let newBlog = new Blog({
    ...body,
    likes: request.body.likes || 0,
    user: user._id
  })

  const savedBlog = await newBlog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const body = request.params
  const blog = await Blog.findById(body.id)

  if (!blog) {
    throw new Error('BlogNotFound')
  }

  // haetaan blogin luonut käyttäjä sekä sitä poistava käyttäjä
  const blogUser = await User.findById(blog.user)
  const loggedInUser = request.user

  if (!blogUser) {
    throw new Error('UserNotFound')
  }

  if (blogUser._id.toString() !== loggedInUser._id.toString()) {
    return response.status(401).json({ error: 'unauthorized' })
  }

  await Blog.findByIdAndRemove(body.id)

  // blogId is an ObjectId niin pitää kääntää
  loggedInUser.blogs = loggedInUser.blogs.filter(blogId => blogId.toString() !== blog._id.toString())
  await loggedInUser.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  // poistetaan turhat kentät, koska monkuusi ei tykkää niistä ja heittää 400 bad request
  // eslint-disable-next-line no-unused-vars
  const { id, user, ...rest } = request.body
  const blog = {
    ...rest,
    likes: request.body.likes || 0
  }
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter

/**
  Middlewareja voitaisiin samaan tapaan rekisteröidä myös
  ainoastaan yksittäisten routejen yhteyteen:

 router.post('/', userExtractor, async (request, response) => {
  // ...
}
*/