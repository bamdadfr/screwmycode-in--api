const express = require('express')
const cors = require('cors')
const { exec } = require('child_process')

const app = express()
const port = 5000
const youtubeUrl = 'https://www.youtube.com/watch?v='

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/youtube/:id', cors(), (req, res) => {
  const id = req.params.id
  console.log('id', id)

  let response, title, url
  exec('youtube-dl -e -f 140 -g ' + youtubeUrl + id, (err, stdout, stderr) => {
    if (err) { return }

    response = stdout.split('\n')
    title = response[0]
    url = response[1]

    res.send({
      title,
      url,
      err: stderr
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
