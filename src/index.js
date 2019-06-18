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

const fetchUrl = url => new Promise((resolve) => {
  https.get(url, (r) => {
    if (r.statusCode === 200) {
      resolve(r.res.headers['content-type'])
    } else {
      resolve(false)
    }
  })
})

const isMp4 = headers => headers === 'audio/mp4'

// TODO: add xml parsing to get <baseUrl> in xml/dash file
const isDash = (headers) => {
  if (headers === 'video/vnd.mpeg.dash.mpd') {
    return true
  }
  return false
}

const execShellCommand = (baseUrl, id) => new Promise((resolve, reject) => {
  exec(`youtube-dl -e -f 140 -g ${baseUrl}${id}`, (err, stdout, stderr) => {
    if (err) {
      reject({
        continue: false,
        err,
      })
    } else {
      const [title, url] = stdout.split('\n')
      fetchUrl(url)
        .then((fetchUrlResult) => {
          if (!fetchUrlResult) {
            console.log('success')
            console.log(fetchUrlResult)

            let audioUrl = ''

            if (isMp4(fetchUrlResult)) {
              audioUrl = url
            }

            if (isDash(fetchUrlResult)) {
              audioUrl = 'test'
            }

            resolve({
              success: true,
              title,
              url: audioUrl,
              err: stderr,
            })
          } else {
            reject({
              continue: true,
              err: 'HTTP request answer != 200, retrying...',
            })
          }
        })
        .catch(fetchUrlError => console.log('fetchUrlError:', fetchUrlError))
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

app.get('/youtube/:id', cors(), (req, res) => {
// app.get('/youtube/:id', (req, res) => {
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
