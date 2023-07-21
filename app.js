const express = require('express')
const { engine }  = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const router = require('./routes')

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
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(router)

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})

