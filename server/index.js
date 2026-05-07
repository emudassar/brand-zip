import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import apiRouter from './routes/api.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
let reconnectTimer = null
const allowedOrigins = Array.from(
  new Set(
    [process.env.CLIENT_URL, process.env.CLIENT_URLS, 'http://localhost:5173', 'https://brand-zip.vercel.app']
      .filter(Boolean)
      .flatMap((value) => String(value).split(','))
      .map((value) => value.trim().replace(/\/$/, ''))
      .filter(Boolean),
  ),
)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true)
        return
      }

      const normalizedOrigin = String(origin).replace(/\/$/, '')
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true)
        return
      }

      callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', async (req, res) => {
  try {
    return res.status(200).json({
      status: 'ok',
      message: 'BrandZip server is running',
      dbConnected: mongoose.connection.readyState === 1,
      timestamp: new Date(),
    })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Health check failed',
    })
  }
})

app.use('/api', apiRouter)

const connectMongo = async () => {
  try {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      return
    }
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.error('MongoDB connection error:', error.message)
  }
}

mongoose.connection.on('disconnected', () => {
  if (reconnectTimer) return
  reconnectTimer = setInterval(async () => {
    if (mongoose.connection.readyState === 1 || mongoose.connection.readyState === 2) {
      clearInterval(reconnectTimer)
      reconnectTimer = null
      return
    }
    await connectMongo()
  }, 5000)
})

const startServer = async () => {
  await connectMongo()

  app.listen(port, () => {
    console.log(`BrandZip server listening on port ${port}`)
  })
}

startServer()
