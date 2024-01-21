const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogController')
const usersRouter = require('./controllers/userController')
const loginRouter = require('./controllers/login')
const { tokenExtractor } = require('./utils/middleware')
const logger = require('./utils/logger')
const errorHandler = require('./utils/middleware').errorHandler
const unknownEndpoint = require('./utils/middleware').unknownEndpoint
const { MONGO_URI, MONGO_PASSWORD } = require('./utils/config')

const mongoURI = MONGO_URI.replace('<password>', MONGO_PASSWORD)
const mongoose = require('mongoose')

mongoose.connect(mongoURI)
  .then(() => {
    logger.info('connected to the database')
  }).catch(() => { logger.info('problem with connecting to db')})


app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

// voi ketjuttaa tämmöi, niin MW käytetään vain tietyissä poluissa
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(unknownEndpoint)

app.use(errorHandler)

module.exports = app