require('dotenv').config()

const bodyParser = require('body-parser')
const cors = require('cors')
const dns = require('dns')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(console.error)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'))

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongoose connection error:'))
db.once('open', () => {
  console.log('Mongoose connected')
  urlShortener()
})

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(
    'Server listening at http://%s:%s',
    server.address().host || 'localhost',
    server.address().port
  )
})

const urlShortener = () => {
  const urlSchema = new mongoose.Schema({ url: String })

  const Url = new mongoose.model('Url', urlSchema)

  app.post('/api/shorturl/new', (req, res) => {
    const url = req.body.url

    dns.lookup(url, err => {
      if (err) return res.json({ error: 'invalid URL' })

      Url.findOne({ url: url }, (err, doc) => {
        if (err) return console.error(err)

        if (!doc) {
          doc = new Url({ url: url })
          doc.save(err => {
            if (err) return console.error(err)
          })
        }

        res.json({ original_url: doc.url, short_url: doc._id })
      })
    })
  })

  app.get('/api/shorturl/:id', (req, res) => {
    Url.findById(req.params.id, (err, url) => {
      if (err) return console.error(err)
      res.redirect('http://' + url.url)
    })
  })
}
