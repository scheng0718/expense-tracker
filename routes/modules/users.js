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
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'All fields are required.'})
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Password and Confirm Password are not matched.'})
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  User.findOne({ email })
    .lean()
    .then(user => {
      if (user) {
        errors.push({ message: 'Email address has been registered!'})
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
            .then(() => {
              req.flash('success_msg', 'Your account is created. Please sign in.')
              res.redirect('/users/login')
            })
            .catch(error => console.log(error)))   
    })
    .catch(error => console.log(error))
})

router.get('/login', (req, res) => {
  res.render('login', { emailInput: req.flash('emailInput')})
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { 
      return next(err) 
    }
    req.flash('success_msg', 'You have signed out successfully!')
    res.redirect('/users/login')
  })
})

module.exports = router