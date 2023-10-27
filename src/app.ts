import express from 'express'
import database from '@config/database'
import router from '@root/routes/routes'

database()
const app = express()
// Middleware to parse JSON bodies
app.use(express.json())
// Use the user routes
app.use('/api', router)

export default app
