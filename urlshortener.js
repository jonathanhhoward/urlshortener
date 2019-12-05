module.exports = (mongooseRef) => {
  const router = require('express').Router()
  const dns = require('dns')

  const urlSchema = new mongooseRef.Schema({ url: String })
  const Url = new mongooseRef.model('Url', urlSchema)

  router.post('/new', (req, res) => {
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

  router.get('/:id', (req, res) => {
    Url.findById(req.params.id, (err, url) => {
      if (err) return console.error(err)
      res.redirect('http://' + url.url)
    })
  })

  return router
}
