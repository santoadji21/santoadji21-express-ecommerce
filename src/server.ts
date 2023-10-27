import http from 'http'

import { config } from '@config/environment'
import app from '@root/app'

const server = http.createServer(app)
server.listen(config.SERVER_PORT || 3000, () => {
  console.log(`Server is running on port ${config.SERVER_PORT || 3000}`)
})
