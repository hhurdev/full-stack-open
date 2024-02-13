const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

// käyttää mongoosen Schema.set(); voi kustomoida miten dokumentit käännettään JSONiksi
blogSchema.set('toJSON', {
  // document on osa transforming signaturea, vaikkei sitä käytetä. Voisi myös ignooraa esim käyttämällä _ tms
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('Blog', blogSchema)

module.exports = Blog
