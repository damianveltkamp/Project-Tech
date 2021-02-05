import express from 'express'
import nunjucks from 'nunjucks'
import compression from 'compression'
import fs from 'fs'
import path from 'path'
import bodyParser from 'body-parser'
import router from './routes/index.routes'

const port = process.env.PORT || 8888,
  app = express(),
  urlEncodedParser = bodyParser.urlencoded({ extended: true })

nunjucks.configure(['views', ...getComponentPaths()], {
    autoescape: true,
    express: app
})

app
  .use(compression())
  .use(bodyParser.json())
  .use(urlEncodedParser)
  .use('/', router)
  .set('view engine', 'html')
  .listen(port, () => console.log(`Using port: ${port}`))


function getComponentPaths() {
  const componentsPath = 'source/components'
  const components = fs.readdirSync(componentsPath)

  const templatePaths = components.map(component => {
    return `${componentsPath}/${component}/template/`
  })

  return templatePaths
}
