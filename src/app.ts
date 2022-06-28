import express from 'express'
import cors from 'cors'
import productRoutes from './routes/products.routes'
import basketRoutes from './routes/basket.routes'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import config from './config'

const app = express()

// settings
app.set('port', config.port)

// Middlewares
app.use(cors())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.json())

// Routes
app.use('/api', productRoutes)
app.use('/api', basketRoutes)

export default app
