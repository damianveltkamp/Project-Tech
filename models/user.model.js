import mongoose from 'mongoose'


const schema = mongoose.Schema
mongoose.set('useCreateIndex', true)


const cluster_schema = new schema({
  username: {
    type: String,
    required: [true, 'Usernmame field is required'],
    unique: [true, 'A user with this username already exists']
  },
  password: {
    type: String,
    required: [true, 'Password field is required']
  }
})


export default mongoose.model('users', cluster_schema)
