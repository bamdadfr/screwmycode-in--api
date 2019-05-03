const express = require('express')
const { exec } = require('child_process')

const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/:id', (req, res) => {

  const id = req.params.id

  console.log('id', id)

  exec('youtube-dl -f 140 -g https://www.youtube.com/watch?v=' + id, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      return
    }

    res.send({
      res: stdout,
      err: stderr
    })

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`)
    console.log(`stderr: ${stderr}`)
  })

})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
