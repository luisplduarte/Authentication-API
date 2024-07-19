const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const passport = require('passport')
require('dotenv').config()

dotenv.config() // Configure dotenv to access environment variables

mongoose.connect(process.env.MONGO_URI) // Connect to DB

const app = express()  // Setup express server

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(passport.initialize()) // Passport middleware
require('./passport')(passport)  // Passport config

const indexRouter = require('./routes/index')
app.use('/', indexRouter)

module.exports = app