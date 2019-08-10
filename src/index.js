const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const { exec } = require('child_process')
const https = require('https')
const fetch = require('node-fetch')
const parser = require('fast-xml-parser')

// INIT

const app = express()
const port = 5000

/*

  GLOBAL FUNCTIONS

 */

const checkUrl = url => new Promise((resolve) => {
  https.get(url, (r) => {
    const response = {
      success: false,
      type: '',
      dashUrl: null,
    }

    if (r.statusCode === 200) {
      if (r.headers['content-type'] === 'video/vnd.mpeg.dash.mpd') {
        response.success = true
        response.type = 'dash'

        fetch(url)
          .then(res => res.text())
          .then(xml => parser.parse(xml, {
            ignoreAttributes: false,
          }))
          .then(json => response.dashUrl = json.MPD.Period.AdaptationSet[1].Representation.BaseURL)
          .then(r => resolve(response))
          .catch(err => console.warn(err))
      } else {
        response.success = true
        response.type = 'audio'
        resolve(response)
      }
    } else {
      resolve(response)
    }
  })
})

const execShellCommand = (baseUrl, id) => new Promise((resolve, reject) => {
  exec(`torify youtube-dl -e -f 140 -g ${baseUrl}${id}`, (err, stdout, stderr) => {
    if (err) {
      reject({
        continue: false,
        err,
      })
    } else {
      const [title, url] = stdout.split('\n')
      checkUrl(url)
        .then((r) => {
          if (r.success) {
            console.log('success')
            resolve({
              success: true,
              type: r.type,
              title,
              url,
              dashUrl: r.dashUrl,
              err: stderr,
            })
          } else {
            reject({
              continue: true,
              err: 'HTTP request answer != 200, retrying...',
            })
          }
        })
        .catch(err => console.log('checkUrl: ', err))
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
