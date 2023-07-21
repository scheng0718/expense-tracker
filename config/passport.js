const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy
const User = require('../models/user')
const bcrypt = require('bcryptjs')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env' })
}
// local strategy
const localStrategy = new LocalStrategy({ 
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
  })
// Facebook Strategy
const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']
  },(accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) {
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(error => done(error, false))
      })
      .catch(error => console.log(error))
  })
// Google Strategy
const googleStrategy = new GoogleStrategy({
      clientID: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK
  },(accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) {
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(error => done(error, false))
      })
  })  
// Github Strategy
const gitHubStrategy = new GitHubStrategy({
      clientID: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK
  },(accessToken, refreshToken, profile, done) => {
    const { name, email } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) {
          return done(null, user)
        }
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(error => done(error, false))
      })
  })

function usePassport(app) {
  // initialize Passport modules
  app.use(passport.initialize())
  app.use(passport.session())
  // log in strategies
  passport.use(localStrategy)
  passport.use(facebookStrategy)
  passport.use(googleStrategy)
  passport.use(gitHubStrategy)
  // serialization and deserialization
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

module.exports = usePassport