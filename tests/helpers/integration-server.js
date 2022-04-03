import path from 'path'
import express from 'express'
const servers = {}

import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function logAllRequests (app) {
  app.use(function (req, res, next) {
    console.log('[Integration Server] [Log All Requests]', req.originalUrl)
    next()
  })
}

async function setupStaticRoutes (app) {
  const serverPath = path.join(__dirname, '../../build/xdfmadev/parcel')
  console.log('[Integration Server] [Setup Static Routes]', serverPath)
  app.use('/', express.static(serverPath))
}

async function startServer (port = 9757) {
  if (servers[port]) {
    return Promise.resolve(servers[port])
  }

  let serverReady, serverError
  const ready = new Promise((resolve, reject) => {
    serverReady = resolve
    serverError = reject
  })

  servers[port] = ready
  const serverInfo = {}

  try {
    const app = express()
    const steps = [logAllRequests, setupStaticRoutes]
    await Promise.all(steps.map(async fn => {
      await fn(app)
    }))

    const server = app.listen(port, function () {
      const port = server.address().port
      console.log('[DFMA HTML5 Map Viewer] Integration Server listening at http://%s:%s/', 'localhost', port)
      serverInfo.basepath = `http://localhost:${port}/`
      serverReady(serverInfo)
    })
    serverInfo.server = server
    servers[port] = serverInfo
  } catch (ex) {
    serverError({
      basepath: serverInfo.basepath,
      server: serverInfo.server,
      error: ex
    })
  }

  return ready
}

export default startServer
