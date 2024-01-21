const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, oneNewBlog, initializeDatabase, getToken } = require('./test_helper')
const api = supertest(app)

beforeEach(async () => {
  await initializeDatabase()
})

describe('when there are initial blogs saved in the database', () => {
  let userId
  let token

  beforeEach(async () => {
    const newUser = {
      username: 'testikäyttäjä',
      password: 'testisalasana',
      name: 'Basil Leaf'
    }

    const userResponse = await api
      .post('/api/users')
      .send(newUser)

    userId = userResponse.body.id

    token = await getToken(api, newUser)
  })

  test('correct amount of blogs are returned as json', async () => {
    const response = await api
      .get('/api/blogs') //returns a supertest test object, sisältää erinäisiä metodeja
      .expect(200) //supertest assertion; not jest. Checks properties of the HTTP res itself; headers, status etc
      .expect('Content-Type', /application\/json/)
    expect(response.body.length).toBe(initialBlogs.length) //jest assertion
  })

  test('returned blogs have a valid id field', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  })

  test('a blog is added correctly', async () => {
    // Create a blog post associated with the user
    const newBlog = {
      ...oneNewBlog,
      user: userId  // Include the user ID
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog) //supertest send not mongoose send
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    const titles = blogsAtEnd.body.map(blog => blog.title)

    expect(blogsAtEnd.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('Uuden blogin lisäys')

    // blogi lisättiin käyttäjälle myös
    const userAtEnd = await api.get(`/api/users/${userId}`)
    expect(userAtEnd.body.blogs[0]).toEqual(blogResponse.body.id)
  })

  test('likes default to 0 if no value is given', async () => {
    const blogWithNoLikes = {
      title: 'Kukaan ei pidä minusta',
      author: 'Loner',
      url: 'takapajula',
      user: userId
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(blogWithNoLikes) //supertest send not mongoose send
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('responds with 400 bad request when no title is given', async () => {
    const newBlogWithoutTitle = {
      author: 'Otso',
      url: 'metsä',
      likes: 0,
      user: userId
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('responds with 400 bad request when no url is given', async () => {
    const newBlogWithoutUrl = {
      title: 'Olen koditon',
      author: 'Homeless',
      likes: 1,
      user: userId
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('a blog is deleted correctly from both blog and user databases', async () => {
    // Luo uusi blogi uudelle käyttäjälle (token systeemi vaatii sen)
    const newBlog = {
      title: 'Uusi blogi',
      author: 'Basil Leaf',
      url: 'uusiosoite',
      likes: 2,
      user: userId
    }

    const blogResponse = await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)

    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body.find(blog => blog.id === blogResponse.body.id)

    // poistetaan blogi tietokannasta
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    //palauttaa supertestin responsen, jolla body ominaisuus muiden joukossa
    // haetaan blogin kirjoittanut käyttäjä
    const userResponse = await api
      .get(`/api/users/${userId}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body.length).toBe(blogsAtStart.body.length - 1)
    expect(userResponse.body.blogs).not.toContainEqual(blogToDelete.id)
  })

  test('a blog is updated correctly', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    // eslint-disable-next-line no-unused-vars
    const { id, user, ...rest } = blogToUpdate

    const updatedBlog = {
      ...rest,
      likes: blogToUpdate.likes + 2
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body[0].likes).toBe(blogToUpdate.likes + 2)
  })
})

//sulkee testien jälkeen tietokantayhteyden
//yksittäisten testien kanssa voi tulla ongelmia, ettei yhteys sulkeudu
afterAll(async () => {
  await mongoose.connection.close()
})