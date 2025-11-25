import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import citiesRouter from './routes/cities.routes'
import paymenttypeRouter from './routes/paymenttype.routes'
import productsRouter from './routes/products.routes'
import producttypesRouter from './routes/producttypes.routes'
import reviewsRouter from './routes/reviews.routes'
import rolesRouter from './routes/roles.routes'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import ordersRouter from './routes/orders.routes'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'
import fs from 'fs'
import path from 'path'
const file = fs.readFileSync(path.join('./api-swagger.yaml'), 'utf8')
const swaggerDocument = YAML.parse(file)

dotenv.config()

databaseService.connect().then(() => {
  databaseService.indexUsers()
  databaseService.indexRefreshTokens()
  databaseService.indexProducts()
})

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
// middlewares
app.use('/auth', usersRouter)
// app.use('/users', usersRouter)
app.use('/products', productsRouter)
app.use('/cities', citiesRouter)
app.use('/roles', rolesRouter)
app.use('/producttypes', producttypesRouter)
app.use('/paymenttype', paymenttypeRouter)
app.use('/reviews', reviewsRouter)
app.use('/orders', ordersRouter)

app.use('/test', (req, res) => {
  res.send('This is a test endpoint.')
})

app.use(defaultErrorHandler)

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
