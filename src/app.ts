import express from 'express'
import database from '@config/database'
import router from '@root/routes/routes'
import { notFoundErrorHandler } from '@utils/response'

database()
const app = express()

// Middleware to parse JSON bodies
app.use(express.json())
// Use the user routes
app.use('/api', router)
app.use(notFoundErrorHandler)

export default app
