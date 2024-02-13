import axios from 'axios'
const baseUrl = '/api/login'

let token = ''

const getToken = async () => {
  return token
}

const login = async (credentials) => {
  console.log('login credentials: ', credentials)
  const response = await axios.post(baseUrl, credentials)
  token = response.data.token
  console.log('login response: ', response.data)
  return response.data
  // pitäisi palauttaa { token, username, name }
}

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

export {
  login,
  getToken,
  setToken
}