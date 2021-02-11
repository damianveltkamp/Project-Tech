import express from 'express'
import bodyParser from 'body-parser'
import base from '../controllers/default.controller'
import user from '../controllers/user.controller'

const router = express.Router()

router.get('/', base.home)
router.get('/register', user.register)
router.post('/register-user', user.registerUser, user.register)
router.get('*', base.notFound)

export default router
