import fetch from 'node-fetch';
import redis from 'redis';
import userController from './database/users.controller';
import userSettingsController from './database/users.settings.controller';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export function register(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Register page',
    errors: req.errors,
    captchaSiteKey: process.env.CAPTCHA_SITE_KEY,
  };

  res.render('pages/register.html', data);
}

export async function registerUser(req, res, next) {
  req.errors = await validateRegisterForm(
    req.body,
    req.connection.remoteAddress,
  );

  if (!Object.keys(req.errors).length) {
    const hashedPass = await hashPassword(req.body.password);
    const userCreationErrors = await userController.createNewUser(
      req.body.email,
      hashedPass,
      createEmailToken(),
    );

    if (userCreationErrors.message) {
      req.errors.default = userCreationErrors.message;
    }

    return next();
  } else {
    return next();
  }
}

export async function verify(req, res) {
  //TODO Fix thanks for verifying your account page
  const value = await userController.verify(req.query.token);

  const data = {
    layout: 'layout.html',
    title: 'Verify page',
  };

  res.render('pages/verify.html', data);
}

export function login(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Login page',
    errors: req.errors,
    captchaSiteKey: process.env.CAPTCHA_SITE_KEY,
  };

  res.render('pages/login.html', data);
}

export async function loginUser(req, res, next) {
  const user = await userController.getUser(req.body.email);

  req.errors = await validateLoginForm(
    user,
    req.body,
    req.connection.remoteAddress,
  );

  if (!Object.keys(req.errors).length) {
    req.loggedInUser = user._id;
  }

  return next();
}

export async function onboardingFlow(req, res) {
  const data = {
    layout: 'layout.html',
    title: 'Onboarding page',
  };

  req.session.userID;

  if (req.session.userID) {
    const loggedInUser = await userController.getUserByID(req.session.userID);
    return loggedInUser.hasSetupAccount === true
      ? res.redirect('/')
      : res.render('pages/onboarding.html', data);
  }

  return res.redirect('/login');
}

export async function postOnboardingFlow(req, res, next) {
  const loggedInUser = await userController.getUserByID(req.session.userID);
  userSettingsController.createNewUserProfile(loggedInUser._id, req.body);
  next();
}

export function userSettings(req, res) {
  const data = {};
  res.render('user-settings.html', data);
}

export function updateUserSettings(req, res, next) {
  next();
}

export function resendVerificationEmail(req, res) {
  userController.resendVerificationEmail(req.body.email, createEmailToken());
  res.redirect('/login');
}

/* Helpers */
async function validateLoginForm(
  user,
  { password, ['g-recaptcha-response']: userCaptchaToken },
  remoteAddress,
) {
  const errors = {};
  const isVerifiedUser = await validateUserVerification(user);
  const validCaptcha = await validateCaptcha(userCaptchaToken, remoteAddress);
  const validPassword = await compareHash(password, user.password);

  if (validPassword.succes === false) {
    errors.default = validPassword.message;
  }

  if (validCaptcha.succes === false) {
    errors.captcha = validCaptcha.message;
  }

  if (isVerifiedUser.succes === false && validPassword.succes === true) {
    errors.isVerified = {
      message: isVerifiedUser.message,
      email: isVerifiedUser.email,
    };
  }

  return errors;
}

async function validateUserVerification({ isVerified, email }) {
  return isVerified === false
    ? {
        succes: false,
        message: `The account for ${email} has not been verified, do you want us to send a new verification email?`,
        email: email,
      }
    : { succes: true };
}

async function validateRegisterForm(
  {
    email,
    password,
    repeatPassword,
    ['g-recaptcha-response']: userCaptchaToken,
  },
  remoteAddress,
) {
  const errors = {};
  const validEmail = validateEmail(email);
  const validPassword = validatePassword(password, repeatPassword);
  const validCaptcha = await validateCaptcha(userCaptchaToken, remoteAddress);

  if (validPassword.succes === false) {
    errors.repeatPassword = validPassword.message;
  }

  if (validEmail.succes === false) {
    errors.email = validEmail.message;
  }

  if (validCaptcha.succes === false) {
    errors.captcha = validCaptcha.message;
  }

  return errors;
}

async function validateCaptcha(userCaptchaToken, remoteAddress) {
  if (!userCaptchaToken) {
    return { succes: false, message: 'Please fill in the captcha' };
  }

  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response${userCaptchaToken}&remoteip=${remoteAddress}`;

  const response = await fetch(verifyUrl);

  return response.status === 200
    ? { succes: true }
    : {
        succes: false,
        message: 'Captcha verification went wrong, please try again',
      };
}

function validateEmail(email) {
  const regex = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );
  return regex.test(email) === true
    ? { succes: true }
    : { succes: false, message: 'Provided email is not a valid email adress' };
}

function validatePassword(password, repeatPassword) {
  const regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);

  if (password !== repeatPassword) {
    return { succes: false, message: 'Passwords are not the same' };
  }

  if (regex.test(password) !== true) {
    return {
      succes: false,
      message: 'Password is not compliant with the required password patern',
    };
  }

  return { succes: true };
}

function createEmailToken() {
  return crypto.randomBytes(128).toString('hex');
}

function hashPassword(password) {
  const saltRounds = 10;
  const hashedPass = bcrypt.hash(password, saltRounds);
  return hashedPass;
}

async function compareHash(password, hashedPassword) {
  const passwordsMatch = await bcrypt.compare(password, hashedPassword);
  return passwordsMatch === false
    ? {
        succes: false,
        message: 'Login failed, username or password does not match',
      }
    : { succes: true };
}
