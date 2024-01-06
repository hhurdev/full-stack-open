const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const { initialBlogs, oneNewBlog, initializeBlogs } = require('./test_helper')
const api = supertest(app)

beforeEach(initializeBlogs)

describe('when there are initial blogs saved in the database', () => {
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

    await api
      .post('/api/blogs')
      .send(oneNewBlog) //supertest send not mongoose send
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')
    const titles = response.body.map(blog => blog.title)

    expect(response.body).toHaveLength(initialBlogs.length + 1)
    expect(titles).toContain('Uuden blogin lisäys')
  })

  test('likes default to 0 if no value is given', async () => {
    const blogWithNoLikes = {
      title: 'Kukaan ei pidä minusta',
      author: 'Loner',
      url: 'takapajula',
    }

    const response = await api
      .post('/api/blogs')
      .send(blogWithNoLikes) //supertest send not mongoose send
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toEqual(0)
  })

  test('responds with 400 bad request when no title is given', async () => {
    const newBlogWithoutTitle = {
      author: 'Otso',
      url: 'metsä',
      likes: 0
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
  })

  test('responds with 400 bad request when no url is given', async () => {
    const newBlogWithoutUrl = {
      title: 'Olen koditon',
      author: 'Homeless',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
  })

  test('a blog is deleted correctly', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToDelete = blogsAtStart.body[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body.length).toBe(initialBlogs.length - 1)
  })

  test('a blog is updated correctly', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]

    const updatedBlog = {
      ...blogToUpdate,
      likes: blogToUpdate.likes + 1
    }

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body[0].likes).toBe(blogToUpdate.likes + 1)
  })
})

//sulkee testien jälkeen tietokantayhteyden
//yksittäisten testien kanssa voi tulla ongelmia, ettei yhteys sulkeudu
afterAll(async () => {
  await mongoose.connection.close()
})