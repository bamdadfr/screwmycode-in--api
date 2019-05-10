const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { exec } = require('child_process')
const https = require('https')

// INIT

const app = express()
const port = 5000

/*

  GLOBAL FUNCTIONS

 */


const isUrl200 = url => new Promise((resolve, reject) => {
  https.get(url, (r) => {
    if (r.statusCode === 200) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
})

const execShellCommand = (baseUrl, id) => new Promise((resolve, reject) => {
  exec(`youtube-dl -e -f 140 -g ${baseUrl}${id}`, (err, stdout, stderr) => {
    const [title, url] = stdout.split('\n')

    isUrl200(url)
      .then((is200) => {
        if (is200) {
          resolve({
            success: true,
            title,
            url,
            err: stderr,
          })
        } else {
          reject({
            success: false,
            err: '403',
          })
        }
      })
  })
})

const execShellCommandUntilSuccess = async (baseUrl, id) => {
  try {
    return await execShellCommand(baseUrl, id)
  } catch (err) {
    console.log('403 catched, retrying...', err)
    return await execShellCommand(baseUrl, id)
  }
}

/*

  GLOBAL
  ENDPOINT

 */


app.use(helmet())

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Hello',
  })
})

/*

  YOUTUBE
  ENDPOINT

 */

// Use CORS() for local dev
// remove it for production when behind a Apache Reverse Proxy

app.get('/youtube/:id', cors(), (req, res) => {
// app.get('/youtube/:id', (req, res) => {

  const { id } = req.params
  console.log(new Date(), 'YouTube:', id)

  const baseUrl = 'https://www.youtube.com/watch?v='
  const regEx = /^([0-9A-Za-z_-]{11})$/

  if (regEx.test(id)) {
    execShellCommandUntilSuccess(baseUrl, id)
      .then(r => res.send(r))
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
