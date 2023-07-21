const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

module.exports = app => {
  // 初始化 Passport 模組
  app.use(passport.initialize())
  app.use(passport.session())
  // 設定本地登入策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'The email does not exist.'})  
        }
        return bcrypt.compare(password, user.password).then(isMatched => {
          if (!isMatched) {
            return done(null, false, { message: 'The email or password is incorrect!'})
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