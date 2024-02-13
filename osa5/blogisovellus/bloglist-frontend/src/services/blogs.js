import axios from 'axios'
const baseUrl = '/api/blogs'

//TODO: better error handling
export const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

export const addNewBlog = async ( token, newBlog ) => {
  const config = {
    headers : { Authorization: `bearer ${token}` }
  }

  let response

  try {
    response = await axios.post(baseUrl, newBlog, config)
  } catch (error) {
    console.log('Error adding new blog: ', error)
    // heitä error eteenpäin, jos AddBlog haluaa esim. näyttää notifikaation
    throw error
  }

  return response.data
}

export const updateBlog = async ( blog ) => {
  let response
  try {
    response = await axios.put(
      `${baseUrl}/${blog.id}`,
      blog
    )
  } catch (error) {
    console.log('Error updating blog: ', error)
    throw error
  }
}

export const deleteBlog = async ( blogId, token ) => {
  const config = {
    headers : { Authorization: `bearer ${token}` }
  }

  console.log('deleteBlog token: ', token)
  console.log('config: ', config)

  let response
  try {
    response = await axios.delete(`${baseUrl}/${blogId}`, config )
    console.log('response: ', response)
  } catch (error) {
    console.log('Error deleting blog: ', error)
    // return error.response so that AddBlog can handle it
    // it contains the response from the server
    throw error
  }
}