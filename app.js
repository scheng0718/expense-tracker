const express = require('express')
const mongoose = require('mongoose')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
const port = 3000

app.use('/', (req, res) => {
  res.send('This is test for node.js')
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})