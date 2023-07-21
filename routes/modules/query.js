const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')

router.get('/:category', async (req, res) => {
  const CATEGORY = {
    家居物業: '<i class="fa-solid fa-house fa-lg"></i>',
    交通出行: '<i class="fa-solid fa-van-shuttle fa-lg"></i>',
    休閒娛樂: '<i class="fa-solid fa-face-grin-beam fa-lg"></i>',
    餐飲食品: '<i class="fa-solid fa-utensils fa-lg"></i>',
    其他: '<i class="fa-solid fa-pen fa-lg"></i>'
  }
  const userId = req.user._id
  let totalAmount = 0
  // Promise 風格
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
  
  //await/async 風格
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