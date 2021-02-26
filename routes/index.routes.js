import express from 'express'
import bodyParser from 'body-parser'
import * as base from '../controllers/default.controller'
import * as account from '../controllers/account.controller'
import userController from '../controllers/database/users.controller'

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
router.post('/login', account.loginUser, async (req, res) => {
  if(Object.keys(req.errors).length && req.errors.constructor === Object) {
    return account.login(req, res)
  } else {
    // Set user information in cookie
    const user = await userController.getUserByID(req.loggedInUser)

    req.session.userID = req.loggedInUser

    //req.app.settings.redisClient.setex('loggedInUser', 3600, `${req.loggedInUser}`)
    return user.hasSetupAccount === false ? res.redirect('/onboarding') : res.redirect('/')
  }
})
router.post('/resendVerificationEmail', account.resendVerificationEmail)
router.get('/onboarding', account.onboardingFlow)
router.post('/onboarding', account.postOnboardingFlow, base.home)
router.get('/user-settings', account.userSettings)
router.post('/user-settings', account.updateUserSettings, account.userSettings)
router.get('*', base.notFound)

export default router
