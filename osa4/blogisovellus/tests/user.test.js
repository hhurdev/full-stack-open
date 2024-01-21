const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const { usersInDb, initializeDatabase } = require('./test_helper')

// TODO: onko käyttäjänimi tarpeeksi pitkä; sallitut merkit; salasana tarpeeksi hyvä
// minkä virheen heittää -> päivitä errorHandler

// TODO: varmista, ettei virheellistä käyttäjää voi luoda
// ja vastaus järkevä statuksen ja virhekoodin kannalta (400)

// TODO: token hajotti kaiken.

describe('initially two users in the database',  () => {
  beforeEach(async () => {
    initializeDatabase
  })

  test('getting all users from database works', async () => {
    const allUsers = await usersInDb()
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(allUsers.length)
  })

  test('adding a unique user is successful', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'persikka',
      password: 'aprikoosi'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })

  test('can only add a unique username to the database', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      password: 'uudestaan',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    //tämä oli uniquevalidatorin heittämä
    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

})