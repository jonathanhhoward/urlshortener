require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const urlShortener = require('./urlshortener')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'))

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(console.error)

mongoose.connection
  .on('error', console.error.bind(console, 'Mongoose connection error:'))
  .once('open', () => {
    console.log('Mongoose connected')
    app.use('/api/shorturl', urlShortener(mongoose))
  })

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(
    'Server listening at http://%s:%s',
    server.address().host || 'localhost',
    server.address().port
  )
})
