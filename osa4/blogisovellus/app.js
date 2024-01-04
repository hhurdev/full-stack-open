const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogController')
const logger = require('./utils/logger')
const errorHandler = require('./utils/middleware').errorHandler
const unknownEndpoint = require('./utils/middleware').unknownEndpoint
const { MONGO_URL, MONGO_PASSWORD } = require('./utils/config')

const mongoUrl = MONGO_URL.replace('<password>', MONGO_PASSWORD)
const mongoose = require('mongoose')

mongoose.connect(mongoUrl)
  .then(() => {
    logger.info('connected to the database')
  }).catch(() => { logger.info('problem with connecting to db')})


app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use(unknownEndpoint)

app.use(errorHandler)

module.exports = app