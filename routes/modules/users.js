const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  User.findOne({ email })
    .lean()
    .then(user => {
      if (user) {
        console.log('User has been registered!')
        return res.render('register', {
          name,
          email,
          password,
          confirmPassword
        })
      }
      return bcrypt
        .genSalt(10)
        .then(salt => bcrypt.hash(password, salt))
        .then(hash => User.create({
            name,
            email,
            password: hash
          })
            .then(() => res.redirect('/'))
            .catch(error => console.log(error)))   
    })
    .catch(error => console.log(error))
})

router.get('/login', (req, res) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: 'users/login'
}))

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err) }
    res.redirect('/users/login')
  })
})

module.exports = router