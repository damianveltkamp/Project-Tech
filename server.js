import express from 'express'
import session from 'express-session'
import nunjucks from 'nunjucks'
import compression from 'compression'
import fs from 'fs'
import bodyParser from 'body-parser'
import router from './routes/index.routes'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import redis from 'redis'
import connectRedis from 'connect-redis'

dotenv.config()

const port = process.env.PORT || 3000,
  redisPort = process.env.REDIS_PORT || 6379,
  redisClient = redis.createClient(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASS}@${process.env.REDIS_HOST}:${redisPort}`),
  redisStore = connectRedis(session),
  app = express(),
  urlEncodedParser = bodyParser.urlencoded({ extended: true }),
  dbUrl = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}`

mongoose.connect(dbUrl, { useUnifiedTopology: true, useFindAndModify: false })

nunjucks.configure(['source/views', ...getComponentPaths()], {
  autoescape: true,
  express: app
}).addGlobal('cssBundle', getCssBundleName())

app
  .use(compression())
  .use(bodyParser.json())
  .use(urlEncodedParser)
  .use(session({
    secret: process.env.SESSION_SECRET,
    name: '_redisTesting',
    resave: false,
    saveUninitialized: true,
    store: new redisStore({ client: redisClient, ttl: 86400 }),
  }))
  .use(express.static('static'))
  .set('view engine', 'html')
  .set('redisClient', redisClient)
  .use('/', router)
  .listen(port, () => console.log(`Using port: ${port}`))

function getComponentPaths() {
  const componentsPath = 'source/components'
  const components = fs.readdirSync(componentsPath)

  const templatePaths = components.map(component => {
    return `${componentsPath}/${component}/template/`
  })

  return templatePaths
}

function getCssBundleName() {
  const cssBundle = fs.readdirSync('static/build/css/')
  return cssBundle[0]
}
