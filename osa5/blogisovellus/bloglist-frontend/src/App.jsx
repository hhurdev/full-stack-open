import { useState, useEffect, useRef } from 'react'
import AddBlog from './components/AddBlog'
import Blogs from './components/Blogs'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import { setNotificationWithTimeout } from './utils/notificationHelper'
import * as blogService from './services/blogs'
import * as loginServices from './services/login'

// TODO: useAuth hook, useBlogs hook voisi siistiä koodia; kato myöh
/**
 * 
  const { user, handleLogin, handleLogout } = useAuth()
  const { blogs, handleAddNewBlog, updateBlogLikes, deleteBlogFromServer } = useBlogs(user)
*/

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  // user sisältää { username, name, token }
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(
    {
      message: '',
      type: ''
    })

  /**
    * Refs provide a way to access DOM nodes or React elements created in the
    * render method / hook that creates a mutable object that can be used to store a reference
    * to a DOM element. A mutable object is an object whose state can be changed without
    * causing a re-render of the component.
    * When you create a reference with useRef, it gives you an object with a .current property.
    * You can change .current as much as you want, and React won't cause a re-render.
   */
  const blogFormRef = useRef()

  useEffect(() => {
    console.log('useEffect: getting all blogs...')
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    // check if user is already logged in
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    console.log('useEffect loggedUser', loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      loginServices.setToken(user.token) }
  }, [])

  // LOGIN STUFF
  // ------------------------------

  const handleLogin = async (event) => {
    console.log('Logging in...')
    event.preventDefault()
    try{
      const user = await loginServices.login({
        username, password
      })
      console.log('Logged in successfully')
      setUser(user)
      setUsername('')
      setPassword('')
      console.log('user (from handleLogin): ', user)
      // tallennetaan käyttäjä selaimen muistiin
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
    } catch (e) {
      console.log('error logging in; wrong credentials')
      setNotificationWithTimeout(setNotification, 'Wrong username or password', 'error')
    }
  }

  const handleLogout = async () => {
    console.log('Logging out...')
    setUser(null)
    loginServices.setToken(null)
    window.localStorage.removeItem('loggedInUser')
    console.log('Logged out')
  }

  // BLOG HANDLING STUFF
  // ------------------------------

  const updateBlogLikes = async (updatedBlog) => {
    try {
      await blogService.updateBlog(updatedBlog)
      setBlogs(blogs.map(blog => blog.id === updatedBlog.id ? updatedBlog : blog))
    } catch (error) {
      console.log('Error updating blog: ', error)
    }
  }

  const handleAddNewBlog = async (token, blog) => {
    let addedBlog
    try {
      addedBlog = await blogService.addNewBlog(token, blog)
      // blog.user = { username, name, id }
      // backend palauttaa vain tokenin, joten user pitää lisätä käsin
      addedBlog.user = user
      const newBlogsArray = blogs.concat(addedBlog)
      setBlogs(newBlogsArray)
      setNotificationWithTimeout(
        setNotification,
        `A new blog "${addedBlog.title}" by ${addedBlog.author} added`,
        'success'
      )
    } catch (error) {
      console.log('Error adding new blog: ', error)
      setNotificationWithTimeout(setNotification, 'Please provide title, author and URL', 'error')
    }
  }

  const removeBlogFromState = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }

  const deleteBlogFromServer = async (id, token) => {
    try {
      await blogService.deleteBlog(id, token)
    } catch (error) {
      console.log('Error deleting blog: ', error)
      // handle error here
    }
  }

  // koska ei suositella siirtää reffiä suoraan propseissa
  const toggleBlogFormVisibility = () => {
    blogFormRef.current.toggleVisibility()
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type}/>
      {!user && <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}/>}
      {user &&
        <div>
          <h2>List of blogs</h2>
          <p>{user.name} logged in
            <button type="button" onClick={handleLogout}>Logout</button>
          </p>
          <Blogs
            blogs={blogs}
            user={user}
            updateBlogLikes={updateBlogLikes}
            removeBlogFromState={removeBlogFromState}
            setNotification={setNotification}
            deleteBlogFromServer={deleteBlogFromServer}
          />
          <Togglable buttonLabel='Add blog' ref={blogFormRef}>
            <AddBlog
              token={user.token}
              setBlogs={setBlogs}
              blogs={blogs}
              user={user}
              setNotification={setNotification}
              toggleBlogFormVisibility={toggleBlogFormVisibility}
              handleAddNewBlog={handleAddNewBlog}
            />
          </Togglable>
        </div>
      }
    </div>
  )
}

export default App

