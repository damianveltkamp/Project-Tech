import mongoose from 'mongoose'
import userModel from '../../models/user.model'
import nodemailer from 'nodemailer'
import {google} from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

export default {
  getAll: () => {
    return userModel.find({}).lean()
      .then(users => users)
  },
  getUser: (email) => {
    return userModel.findOne({email: email}).lean()
      .then(user => {
        return user
      })
  },
  getUserByID: (id) => {
    return userModel.findOne({_id: id}).lean()
      .then(user => {
        return user
      })
  },
  createNewUser: async (email, password, emailToken) => {
    const error = {}
    const userAlreadyExists = await userModel.findOne({email: email}).lean()
      .then(user => user)

    if (userAlreadyExists) {
      error.message = `There is already an account created for ${userAlreadyExists.email}`
    }

    const newUser = new userModel({
      email: email,
      password: password,
      emailToken: emailToken
    })

    newUser.save(error => {
      error ? console.log(`Something went wrong: ${error}`) : verificationEmail(email, emailToken)
    })

    return error
  },
  resendVerificationEmail: (email, emailToken) => {
    userModel.findOneAndUpdate({email: email}, {emailToken: emailToken})
      .then(data => {
        verificationEmail(email, emailToken)
      })
  },
  verify: (emailToken) => {
    return userModel.findOneAndUpdate({emailToken: emailToken}, {$set: {isVerified: true, emailToken: ''}}).lean()
      .then(user => user)
  }
}


async function verificationEmail(email, emailToken) {
  const oAuth2Client = setupAuth()
  const accessToken = await oAuth2Client.getAccessToken()

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken.token
    }
  });

  //TODO html dynamisch maken
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify account',
    html: `<a href="http://localhost:3001/verify-account?token=${emailToken}">Click this link to verify your email</a>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    error ? console.log(error.message) : console.log('email send with succes')
  });
}


function setupAuth() {
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)

  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })

  return oAuth2Client
}
