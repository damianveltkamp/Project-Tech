import mongoose from 'mongoose'
import * as model from '../../models/user.model'

export default {
  getAll: () => {
    return model.default.find({}).lean()
  }
}
