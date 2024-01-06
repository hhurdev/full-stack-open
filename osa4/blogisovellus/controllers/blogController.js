const blogsRouter = require('express').Router()
const Blog = require('../models/blogs')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs) /** express uses JSON.stringify to convert. This in turn internally
      calls the .toJSON() method on each blog document (mitä on muokattu)
      This is a feature of JavaScript where if an object has a .toJSON() method,
      JSON.stringify() will automatically call it. Mongoose hyödyntää sitä ominaisuutta
       */
    })
})

blogsRouter.post('/', (request, response) => {
  let newBlog = {
    ...request.body,
    likes: request.body.likes || 0
  }

  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  const blog = new Blog(newBlog)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

blogsRouter.delete('/:id', (request, response) => {
  Blog
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
})

blogsRouter.put('/:id', (request, response) => {
  const blog = {
    ...request.body,
    likes: request.body.likes || 0
  }

  Blog
    .findByIdAndUpdate(request.params.id, blog, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
})

module.exports = blogsRouter