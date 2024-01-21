const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { SECRET } = require('./config')

// muista että req, res, next määrittelee middlewaren
// TODO: voi tehdä jonkunlaisen request loggerin tähänkin appiin

const unknownEndpoint = (request, response) => {
  response.status(404).send({ 'error': 'unknown endpoint' })
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // tallentaa tokenin request-olioon
    request.token = authorization.substring(7)
  }

  next()
}

const userExtractor = async (request, response, next) => {
  //Metodi verify myös dekoodaa tokenin, eli palauttaa olion, jonka perusteella token on laadittu
  // { username, id }
  // jos tokenia ei ole/epävalidi, jwt heittää error JsonWebTokenError (lisätty handleriin)
  const decodedToken = jwt.verify(request.token, SECRET)

  if (!decodedToken.id) {
    //token ok, mutta id ei jostain syystä ole
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

  // palauttaa monkuusin User objektin, mutta sen ominaisuuksiin pääsee suoraan käsiksi
  // vähän ku json and then some käytöksensä puolesta

  if (!user) {
    throw new Error('UserNotFound')
  }

  request.user = user
  next()
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.message === 'UserNotFound') {
    return response.status(404).json({ error: 'user not found' })
  } else if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'BlogNotFound') {
    return response.status(404).json({ error: 'blog not found' })
  } else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ error: 'token missing or invalid' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}