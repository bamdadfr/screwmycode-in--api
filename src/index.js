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

const isUrl200 = url => new Promise((resolve) => {
  https.get(url, (r) => {
    const response = {
      success: false,
      contentType: '',
      dashUrl: null,
    }

    if (r.statusCode === 200) {
      if (r.headers['content-type'] === 'video/vnd.mpeg.dash.mpd') {
        response.success = true
        response.contentType = r.headers['content-type']
        response.dashUrl = 'test'
      } else {
        response.success = true
        response.contentType = r.headers['content-type']
      }
      resolve(response)
    } else {
      resolve(response)
    }
  })
})

const execShellCommand = (baseUrl, id) => new Promise((resolve, reject) => {
  exec(`youtube-dl -e -f 140 -g ${baseUrl}${id}`, (err, stdout, stderr) => {
    if (err) {
      reject({
        continue: false,
        err,
      })
    } else {
      const [title, url] = stdout.split('\n')
      isUrl200(url)
        .then((is200) => {
          if (is200.success) {
            console.log('success')
            resolve({
              success: true,
              title,
              url,
              err: stderr,
            })
          } else {
            reject({
              continue: true,
              err: 'HTTP request answer != 200, retrying...',
            })
          }
        })
        .catch(isUrl200err => console.log('isUrl200', isUrl200err))
    }
  })
})

const execShellCommandUntilSuccess = async (baseUrl, id) => {
  try {
    return await execShellCommand(baseUrl, id)
  } catch (err) {
    if (err.continue) {
      return execShellCommand(baseUrl, id)
    }
    console.log('aborted')
    return ({
      success: false,
      err: err.err,
    })
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

// app.get('/youtube/:id', cors(), (req, res) => {
app.get('/youtube/:id', (req, res) => {
  const { id } = req.params
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

  console.log(new Date(), ip, ' YouTube:', id)

  const baseUrl = 'https://www.youtube.com/watch?v='
  const regEx = /^([0-9A-Za-z_-]{11})$/

  if (regEx.test(id)) {
    execShellCommandUntilSuccess(baseUrl, id)
      .then(r => res.send(r))
      .catch(err => console.log('execShellCommandUntilSuccess', err))
  } else {
    res.send({
      success: false,
      err: 'Wrong YouTube ID',
    })
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
