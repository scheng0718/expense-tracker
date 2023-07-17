const express = require('express')
const app = express()
const port = 3000

app.use('/', (req, res) => {
  res.send('This is test for node.js')
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})