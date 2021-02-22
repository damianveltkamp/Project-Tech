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
  const hashedPass = hashPassword(req.body.password)

  Promise.resolve(hashedPass)
    .then(resolvedHashedPass => {
      !Object.keys(req.errors).length && createNewUser(req.body.email, resolvedHashedPass, createEmailToken())
      return next()
    })
}

function createNewUser(email, password, emailToken) {
  user.createNewUser(email, password, emailToken)
}

function validateUserInformation(userInformation) {
  const errors = {}

  if (userInformation.password !== userInformation.repeatPassword)  {
    errors.repeatPassword = 'Passwords are not the same'
  }


  return errors
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
