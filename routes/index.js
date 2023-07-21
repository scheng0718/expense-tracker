const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const expenses = require('./modules/expenses')
const query = require('./modules/query')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')


router.use('/users', users)
router.use('/expenses', authenticator, expenses)
router.use('/query', authenticator, query)
router.use('/', authenticator, home)

module.exports = router