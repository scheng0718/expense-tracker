const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

router.get('/:category', async (req, res) => {
  const CATEGORY = {
    Household: '<i class="fa-solid fa-house fa-lg"></i>',
    Transportation: '<i class="fa-solid fa-van-shuttle fa-lg"></i>',
    Entertainment: '<i class="fa-solid fa-face-grin-beam fa-lg"></i>',
    Food: '<i class="fa-solid fa-utensils fa-lg"></i>',
    Other: '<i class="fa-solid fa-pen fa-lg"></i>'
  }
  const userId = req.user._id
  let totalAmount = 0
  // Promise style
  Category.findOne({ name: req.params.category}).lean()
    .then(category => {
      return Record.find({categoryId: category._id, userId})
        .populate('categoryId')
        .lean()
        .then(records => records.map(record => {
          record.date = record.date.toISOString().split('T')[0]
          record.categoryIcon = CATEGORY[record.categoryId.name]
          totalAmount += record.amount
          return record
        }))
        .catch(error => console.log(error))
    })
    .then(records => res.render('index', { records, totalAmount }))
    .catch(error => console.log(error))  
  
  //await/async style
  // try {
  //   console.log(req.params.category)
  //   // 找到 category 表中對應的資料
  //   const category = await Category.findOne({ name: req.params.category }).lean()
  //   let records = await Record.find({ categoryId: category._id, userId }).populate('categoryId').lean()
  //   let totalAmount = 0
  //   records = records.map(record => {
  //     record.date = record.date.toISOString().split('T')[0]
  //     record.categoryIcon = CATEGORY[category.name]
  //     totalAmount += record.amount
  //     return record
  //   })
  //   res.render('index', { records, totalAmount })
  // } catch (error) {
  //   console.log(error)
  // }
})

module.exports = router