import user from './database/users.controller'

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

  !Object.keys(req.errors).length && user.createNewUser(req.body.username, req.body.password)
  return next()
}


function validateUserInformation(userInformation) {
  const errors = {}

  if (userInformation.password !== userInformation.repeatPassword)  {
    errors.repeatPassword = 'Passwords are not the same'
  }


  return errors
}
