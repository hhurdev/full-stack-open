import { useState } from 'react'
import { setNotificationWithTimeout } from '../utils/notificationHelper'

//blog.user = { username, name, id }

const Blog = ({
  blog,
  user,
  updateBlogLikes,
  removeBlogFromState,
  deleteBlogFromServer,
  setNotification
}) => {

  const [showDetails, setShowDetails] = useState(false)
  const buttonLabel = showDetails ? 'Hide details' : 'View details'

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const likePost = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1
    }
    try {
      await updateBlogLikes(updatedBlog)
    } catch (error) {
      console.log('Error updating blog: ', error)
    }
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await deleteBlogFromServer(blog.id, user.token) // use the new prop here
        removeBlogFromState(blog.id)
      } catch (error) {
        console.log('Error deleting blog: ', error)
        setNotificationWithTimeout(setNotification, 'Unauthorized to remove blog', 'error')
      }
    }
  }

  const userHasCreatedBlog = (user.username === blog.user.username)

  const blogStyle = {
    margin: 5,
    paddingTop: 0,
    paddingLeft: 5,
    paddingBottom: 5,

    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const listStyle = {
    listStyleType: 'none',
    padding : 0,
    margin: 0
  }

  const blogTitleStyle = {
    cursor: 'pointer',
    paddingRight: 5,
    fontWeight: 'bold'
  }

  return (
    <div style={blogStyle} className='blog'>
      <p>
        <span onClick={toggleShowDetails} style={blogTitleStyle} id='blogTitleSpan'>
          {blog.title}
        </span>
        {blog.author}
        <button onClick={toggleShowDetails} className='detailsButton'>{buttonLabel}</button>
      </p>
      {showDetails &&
      <div>
        <ul style={listStyle}>
          <li>URL: {blog.url}</li>
          <li>Likes: {blog.likes}
            <button onClick={likePost} id='likeButton' className='likeButton'>Like</button>
          </li>
          <li>User: {blog.user.name}</li>
        </ul>
        {userHasCreatedBlog &&
          <button onClick={removeBlog} id='removeButton'>Remove blog</button>
        }
      </div>
      }
    </div>
  )
}

export default Blog