import express from 'express'
import bodyParser from 'body-parser'
import * as base from '../controllers/default.controller'
import * as account from '../controllers/account.controller'

const router = express.Router()

router.get('/', base.home)
router.get('/verify-account', account.verify)
router.get('/register', account.register)
router.post('/register', account.registerUser, (req, res) => {
  if(Object.keys(req.errors).length && req.errors.constructor === Object) {
    return account.register(req, res)
  } else {
    return res.redirect('/')
  }
})
router.get('/login', account.login)
router.get('*', base.notFound)

export default router
