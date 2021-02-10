import express from 'express'
import nunjucks from 'nunjucks'
import compression from 'compression'
import fs from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import router from './routes/index.routes'

const port = process.env.PORT || 3000,
  app = express(),
  urlEncodedParser = bodyParser.urlencoded({ extended: true })

nunjucks.configure(['source/views', ...getComponentPaths()], {
  autoescape: true,
  express: app
}).addGlobal('cssBundle', getCssBundleName())

app
  .use(compression())
  .use(bodyParser.json())
  .use(urlEncodedParser)
  .use(express.static('static'))
  .set('view engine', 'html')
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
  console.log(cssBundle)
  return cssBundle[0]
}
