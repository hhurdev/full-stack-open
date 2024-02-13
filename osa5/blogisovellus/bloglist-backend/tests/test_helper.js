const Blog = require('../models/blogs')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  }
]

const oneNewBlog = {
  title: 'Uuden blogin lisäys',
  author: 'Bloggaaja',
  url: 'jonkinlainenurl',
  likes: 2,
}

const initialUsers = [
  {
    username: 'root',
    password: 'papukaija',
    name: 'Superuser'
  },
  {
    username: 'Oakley',
    password: 'machinery',
    name: 'Hevonen'
  }
]

const blogsInDb = async () => {
  const allBlogs = await Blog.find({})
  return allBlogs.map(blog => blog.toJSON)
}

const usersInDb = async () => {
  const allUsers = await User.find({})
  return allUsers.map(user => user.toJSON())
}

const initializeBlogs = async (users) => {
  await Blog.deleteMany({})

  let userIndex = 0
  const blogObjects = initialBlogs.map(blog => {
    const user = users[userIndex]
    userIndex = (userIndex + 1) % users.length  // Cycle through users
    const newBlog = new Blog({ ...blog, user: user._id })
    user.blogs = user.blogs.concat(newBlog._id)  // Add the blog to the user's blogs
    return newBlog
  })

  await Promise.all(blogObjects.map(blog => blog.save()))
}

const initializeUsers = async () => {
  await User.deleteMany({})

  //salasana sama kaikille
  const userPromises = initialUsers.map(async user => {
    const passwordHash = await bcrypt.hash('sekret', 10)
    return new User({ username: user.username, passwordHash, name: user.name })
  })

  const userModels = await Promise.all(userPromises)

  await Promise.all(userModels.map(user => user.save()))
  return userModels
}

const initializeDatabase = async () => {
  const users = await initializeUsers()
  await initializeBlogs(users)
  await Promise.all(users.map(user => user.save()))
}

const getToken = async (api, user) => {
  const loginResponse = await api
    .post('/api/login')
    .send(user)

  return loginResponse.body.token
}

module.exports = {
  initialBlogs,
  blogsInDb,
  oneNewBlog,
  usersInDb,
  initializeDatabase,
  getToken
}