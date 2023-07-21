const express = require('express')
const { engine }  = require('express-handlebars')
const app = express()
const methodOverride = require('method-override')
const flash = require('connect-flash')
const session = require('express-session')
const usePassport = require('./config/passport')
const router = require('./routes')
require('./config/mongoose')
const port = 3000

app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})
app.use(router)

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})

