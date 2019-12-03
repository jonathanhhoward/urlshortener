require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dns = require('dns')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 3000

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).catch(console.error)

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Mongoose connection error:'))
db.once('open', () => {
  console.log('Mongoose connected')

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
      res.redirect('https://' + url.url)
    })
  })
})

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public'))

app.get('/', (req, res) => res.sendFile(__dirname + '/views/index.html'))

app.listen(port, () => console.log(`Listening on port: ${port}`))
