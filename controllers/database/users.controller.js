import mongoose from 'mongoose'
import userModel from '../../models/user.model'

export default {
  getAll: () => {
    return userModel.find({}).lean()
  },
  createNewUser: (username, password) => {
    const user = new userModel({
      username: username,
      password: password
    })

    user.save(error => {
      error ? console.log(`Something went wrong: ${error}`) : console.log(`New user created: ${user}`)
    })
  },
  updatePassword: () => {

  }
}
