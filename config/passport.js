const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ 
    usernameField: 'email',
    passReqToCallback: true,
  }, (req, email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          req.flash('emailInput', req.body.email)
          return done(null, false, req.flash('warning_msg', 'The email is not registered yet.'))  
        }
        return bcrypt.compare(password, user.password).then(isMatched => {
          if (!isMatched) {
            req.flash('emailInput', req.body.email)
            return done(null, false, req.flash('warning_msg', 'Incorrect email or password.'))
          }
          return done(null, user)
        }) 
      })
      .catch(error => console.log(error))
  }))
  // 設定序列化與反序列化
  passport.serializeUser(function(user, done) {
    done(null, user._id)
  })
  passport.deserializeUser(function(id, done) {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(error => done(error, null))
  })
}