const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
require('express-async-errors')

usersRouter.get('/', async (request, response) => {
  // db stuff could be put into services probs
  // populate näyttää blogien id:n sijaan sisällön; monkuusi tekee pari kyselyä tietokantaan
  // db ei tiedä tästä mitään; populate perustuu monkuusin skeeman ref-määrittelyyn
  const users = await User
    .find({}).populate('blogs', { title: 1, author: 1, url: 1 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const body = request.params
  const user = await User.findById(body.id)

  if (!user) {
    throw new Error('UserNotFound')
  }

  response.json(user)
})

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body

  if (!password || password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  response.status(201).json(savedUser)
})

module.exports = usersRouter