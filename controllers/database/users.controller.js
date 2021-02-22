import mongoose from 'mongoose'
import userModel from '../../models/user.model'
import nodemailer from 'nodemailer'
import { google } from 'googleapis'
import dotenv from 'dotenv'

dotenv.config()

export default {
  getAll: () => {
    return userModel.find({}).lean()
  },
  createNewUser: (email, password, emailToken) => {
    const user = new userModel({
      email: email,
      password: password,
      emailToken: emailToken
    })

    user.save(error => {
      error ? console.log(`Something went wrong: ${error}`) : verificationEmail(email, emailToken)
    })
  },
  updatePassword: () => {

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

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'projecttechhva@gmail.com',
    subject: 'Verify account',
    text: 'Its working node mailer'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log('send with succes')
    }
  });
}


function setupAuth() {
  const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI)

  oAuth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
  })

  return oAuth2Client
}
