const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

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

module.exports = router