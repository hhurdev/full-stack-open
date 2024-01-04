require('dotenv').config()

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URI
const MONGO_PASSWORD = process.env.MONGO_PASSWORD

module.exports = {
  MONGO_URL,
  MONGO_PASSWORD,
  PORT
}
