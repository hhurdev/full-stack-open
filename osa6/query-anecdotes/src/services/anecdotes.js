import axios from 'axios'

const getId = () => (100000 * Math.random()).toFixed(0)

export const getAnecdotes = async () => {
  const response = await axios.get('http://localhost:3001/anecdotes')
  return response.data
}

export const createAnecdote = async (content) => {
  // voi myöhemmin siirtää muualle objektin luonnin
  const object = { content, votes: 0, id: getId() }
  const response = await axios.post('http://localhost:3001/anecdotes', object)
  return response.data
}

export const voteAnecdote = async (anecdote) => {
  const response = await axios.put(`http://localhost:3001/anecdotes/${anecdote.id}`, anecdote)
  return response.data
}