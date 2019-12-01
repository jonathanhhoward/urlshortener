'use strict'

require('dotenv').config()

const express = require('express')
// const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dns = require('dns')

const cors = require('cors')

const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

/** this project needs a db !! **/
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(console.error)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongoose connection error:'))
db.once('open', () => {
  console.log('Mongoose connected')
})

app.use(cors())

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

app.listen(port, () => {
  console.log(`Server listening on port: ${port}`)
})
