/* eslint-disable no-unused-vars */
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import path from 'path'
import dotenv from 'dotenv'

import apiRoutes from './api'
import passport from 'passport'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
})

const app = express()
const { PORT } = process.env

// Mongo Setup
if (process.env.NODE_ENV !== 'test') {
  const { MONGO_URI } = process.env
  if (!MONGO_URI) {
    throw new Error('Mongo URI Not Found')
  }
  mongoose.Promise = global.Promise
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  mongoose.set('useCreateIndex', true)
  mongoose.connection
    .once('open', () => console.log('Connected to Mongo instance.'))
    .on('error', error => console.log('Error connecting to Mongo:', error))
}

// Server Setup
app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/api', apiRoutes)

// Handle errors.
app.use(
  (
    err: { status: number; message: string },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    res.status(err.status || 500)
    res.json({
      error: err.message || 'Encountered an error processing the request',
    })
  }
)

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
})

app.listen(PORT, () => {
  console.log('Node app is running on port', PORT)
})

export default app
