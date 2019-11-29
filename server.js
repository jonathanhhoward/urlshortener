'use strict'

require('dotenv').config()

const express = require('express')
const mongo = require('mongodb')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const cors = require('cors')

const app = express()

// Basic Configuration
const port = process.env.PORT || 3000

/** this project needs a db !! **/
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

app.use(cors())

/** this project needs to parse POST bodies **/
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
})

// your first API endpoint...
app.get('/api/hello', (req, res) => {
  res.json({ greeting: 'hello API' })
})

app.listen(port, () => {
  console.log(`Node.js listening on port ${port} ...`)
})
