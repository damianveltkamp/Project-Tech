import user from './database/users.controller'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

exports.register = (req, res) => {
  const data = {
    layout:  'layout.html',
    title: 'Register page',
    errors: req.errors
  }

  res.render('pages/register.html', data)
}

exports.registerUser = (req, res, next) => {
  req.errors = validateUserInformation(req.body)

  if(!Object.keys(req.errors).length) {
    const hashedPass = hashPassword(req.body.password)

    Promise.resolve(hashedPass)
      .then(resolvedHashedPass => {
        createNewUser(req.body.email, resolvedHashedPass, createEmailToken())
        return next()
      })
  } else {
    return next()
  }
}

exports.verify = (req, res) => {
  Promise.resolve(user.verify(req.query.token))
    .then(value => {
      console.log(value)
    })

  res.send('heey')
}

function createNewUser(email, password, emailToken) {
  user.createNewUser(email, password, emailToken)
}

function validateUserInformation({email, password, repeatPassword}) {
  const errors = {}
  const validEmail = validateEmail(email)
  const validPassword = validatePassword(password, repeatPassword)

  if(validPassword == false) {
    errors.repeatPassword = 'Passwords are not the same'
  }

  if(validEmail == false) {
    errors.email = 'Provided email is not a valid email adress'
  }

  return errors
}

function validateEmail(email) {
  const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  return regex.test(email)
}

function validatePassword(password, repeatPassword) {
  return password !== repeatPassword ? false : true
}

function createEmailToken() {
  return crypto.randomBytes(128).toString('hex');
}

function hashPassword(password) {
  const saltRounds = 10;
  const hashedPass = bcrypt.hash(password, saltRounds)
  return hashedPass
}

function compareHash(password, hashedPassword) {
  bcrypt.compare(password, hashedPassword, function(err, result) {
    console.log('same passwords')
  });
}
