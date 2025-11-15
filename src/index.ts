import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

dotenv.config()

databaseService.connect()
// .then(() => {
//   databaseService.indexUsers()
//   databaseService.indexRefreshTokens()
//   databaseService.indexFollowers()
//   databaseService.indexProvince()
//   databaseService.indexNotifications()
//   databaseService.indexLikes()
//   databaseService.indexBookmark()
//   databaseService.indexHashtags()
// })

const corsOptions = {
  origin: '*', // Replace with the allowed origin
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

const app = express()
const httpServer = createServer(app)

const port = process.env.PORT || 4000
app.use(cors(corsOptions))
app.use(express.json())
// middlewares
app.use('/auth', usersRouter)
app.use('/users', usersRouter)

app.use('/test', (req, res) => {
  res.send('This is a test endpoint.')
})

app.use(defaultErrorHandler)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
