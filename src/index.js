const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { exec } = require('child_process')

// INIT

const app = express()
const port = 5000
const youtubeUrl = 'https://www.youtube.com/watch?v='

const regExp = /([0-9A-Za-z_-]{11})/

// API Service

app.use(helmet())

app.get('/', (req, res) => {
  res.send('Hello')
})

// app.get('/youtube/:id', cors(), (req, res) => {
app.get('/youtube/:id', (req, res) => {
  const { id } = req.params
  console.log('id', id)

  if (regExp.test(id)) {
    exec(`youtube-dl -e -f 140 -g ${youtubeUrl}${id}`, (err, stdout, stderr) => {
      if (err) { return }

      const response = stdout.split('\n')
      const [title, url] = response

      res.send({
        title,
        url,
        // err: stderr,
      })
    })
  } else {
    res.send({
      err: 'Wrong YouTube ID',
    })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
