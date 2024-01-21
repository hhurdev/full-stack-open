const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  passwordHash: String,
  name: {
    type: String,
    required: true,
    minlength: 3
  },
  //blogin type on vain mongoosen ymmärtämä juttu; Mongo ei tiedä että viittaa muistiinpanoihin
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

// mongoosella ei ole tapaa varmistua, että käyttäjänimi on uniikki
// voisi totetuttaa toki myös manuaalisesti
userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = new mongoose.model('User', userSchema)

module.exports = User