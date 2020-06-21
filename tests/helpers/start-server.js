const startServer = require('./integration-server')

let closeTimeout

before(async () => {
  if (closeTimeout) {
    console.log('[Integration Server] Keeping server alive')
    clearTimeout(closeTimeout)
  } else {
    console.log('[Integration Server] Starting server')
  }
  await startServer()
})

after(async () => {
  const { server } = await startServer()
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
  closeTimeout = setTimeout(() => {
    clearTimeout(closeTimeout)
    server.close()
    console.log('[Integration Server] Server closed')
  }, 500)
})
