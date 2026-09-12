import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.js'
import problemRoutes from './routes/problems.js'

const app = express()

app.use(cors({
  origin: process.env.CLIENT_URL?.split(',') || 'http://localhost:5173'
}))

app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) =>
  res.json({
    status: 'ok',
    service: 'samadhan-setu-api'
  })
)

app.use('/api/auth', authRoutes)
app.use('/api/problems', problemRoutes)

app.use((_req, res) =>
  res.status(404).json({
    message: 'Route not found.'
  })
)

app.use((error, _req, res, _next) => {
  console.error(error)
  res.status(500).json({
    message: 'Something went wrong on the server.'
  })
})

export default app
