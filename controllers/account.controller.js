import fetch from 'node-fetch'
import user from './database/users.controller'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import dotenv from 'dotenv'

dotenv.config()

export function register(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Register page',
    errors: req.errors,
    captchaSiteKey: process.env.CAPTCHA_SITE_KEY
  }

  res.render('pages/register.html', data)
}

export async function registerUser(req, res, next) {
  req.errors = await validateRegisterForm(req.body, req.connection.remoteAddress)

  if (!Object.keys(req.errors).length) {
    const hashedPass = await hashPassword(req.body.password)
    const userCreationErrors = await user.createNewUser(req.body.email, hashedPass, createEmailToken())

    if (userCreationErrors.message) {
      req.errors.default = userCreationErrors.message
    }

    return next()
  } else {
    return next()
  }
}

export async function verify(req, res) {
  //TODO figure out what i wanted to do here again
  const value = await user.verify(req.query.token)
  console.log(value)

  const data = {
    layout: 'layout.html',
    title: 'Verify page'
  }

  res.render('pages/verify.html', data)
}

export function login(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Login page',
    errors: req.errors,
    captchaSiteKey: process.env.CAPTCHA_SITE_KEY
  }

  res.render('pages/login.html', data)
}

export async function loginUser(req, res, next) {
  req.errors = await validateLoginForm(req.body, req.connection.remoteAddress)

  if(!Object.keys(req.errors).length) {
    console.log(req.body.email)
    req.loggedInUser = req.body.email
  }

  return next()
}


/* Helpers */
async function validateLoginForm({email, password, ['g-recaptcha-response']: userCaptchaToken}, remoteAddress) {
  const errors = {}
  const validCaptcha = await validateCaptcha(userCaptchaToken, remoteAddress)
  const hashedPassword = await user.getHashedPassword(email)
  const validPassword = await compareHash(password, hashedPassword)

  console.log(validPassword)

  if(validPassword === false) {
    errors.default = 'Login failed, username or password does not match'
  }

  if (validCaptcha.succes === false) {
    errors.captcha = validCaptcha.message
  }

  return errors
}

async function validateRegisterForm({email, password, repeatPassword, ['g-recaptcha-response']: userCaptchaToken}, remoteAddress) {
  const errors = {}
  const validEmail = validateEmail(email)
  const validPassword = validatePassword(password, repeatPassword)
  const validCaptcha = await validateCaptcha(userCaptchaToken, remoteAddress)

  if (validPassword.succes === false) {
    errors.repeatPassword = validPassword.message
  }

  if (validEmail.succes === false) {
    errors.email = validEmail.message
  }

  if (validCaptcha.succes === false) {
    errors.captcha = validCaptcha.message
  }

  return errors
}

async function validateCaptcha(userCaptchaToken, remoteAddress) {
  if (!userCaptchaToken) {
    return {succes: false, message: 'Please fill in the captcha'}
  }

  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response${userCaptchaToken}&remoteip=${remoteAddress}`

  const response = await fetch(verifyUrl)

  return response.status === 200 ? {succes: true} : {succes: false, message: 'Captcha verification went wrong, please try again'}
}

function validateEmail(email) {
  const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  return regex.test(email) === true ? {succes: true} : {succes: false, message: 'Provided email is not a valid email adress'}
}

function validatePassword(password, repeatPassword) {
  const regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)

  if (password !== repeatPassword) {
    return {succes: false, message: 'Passwords are not the same'}
  }

  if (regex.test(password) !== true) {
    return {succes: false, message: 'Password is not compliant with the required password patern'}
  }

  return {succes: true}
}

function createEmailToken() {
  return crypto.randomBytes(128).toString('hex')
}

function hashPassword(password) {
  const saltRounds = 10
  const hashedPass = bcrypt.hash(password, saltRounds)
  return hashedPass
}

function compareHash(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword)
}
