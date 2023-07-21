const express = require('express')
const router = express.Router()
const home = require('./modules/home')
const expenses = require('./modules/expenses')
const query = require('./modules/query')

router.use('/', home)
router.use('/expenses', expenses)
router.use('/query', query)


module.exports = router