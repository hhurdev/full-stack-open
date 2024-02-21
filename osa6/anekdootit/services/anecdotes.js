import axios from 'axios'
import { getId } from '../src/utils/helpers.js'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// TODO: anekdootin luominen ei parasta olla tässä
const createNew = async (content) => {
  const anecdote = { content, id: getId(), votes: 0 }
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const updateAnecdote = async (id, anecdote) => {
  console.log('updating value on server: ', anecdote)
  const response = await axios.put(`${baseUrl}/${id}`, anecdote)
  console.log('response.data voting: ', response.data)
  return response.data
}

export default { 
  getAll,
  createNew,
  updateAnecdote
}