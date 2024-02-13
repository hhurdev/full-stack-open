const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body
  const user = await User.findOne({ username })

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(
    userForToken,
    SECRET,
    { expiresIn: 60*60 }
  )

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter

/**
 Usein tokeneita vastaava sessio, eli tieto tokenia vastaavasta käyttäjästä,
 talletetaankin esim. avain-arvo-periaattella toimivaan Redis-tietokantaan,
 joka on toiminnallisuudeltaan esim MongoDB:tä tai relaatiotietokantoja rajoittuneempi,
 mutta toimii tietynlaisissa käyttöskenaarioissa todella nopeasti.
 Käytettäessä palvelinpuolen sessioita, token ei useinkaan sisällä jwt-tokenien tapaan
 mitään tietoa käyttäjästä (esim. käyttäjätunnusta), sen sijaan token on ainoastaan
 satunnainen merkkijono, jota vastaava käyttäjä haetaan palvelimella sessiot tallettavasta tietokannasta.
 On myös yleistä, että palvelinpuolen sessiota käytettäessä tieto käyttäjän identiteetistä
 välitetään Authorization-headerin sijaan evästeiden (engl. cookie) välityksellä.
 */