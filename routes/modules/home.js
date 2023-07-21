const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// 首頁內容顯示所有支出費用
router.get('/', (req, res) => {
  // 載入 icon 圖檔
  const CATEGORY = {
    Household: '<i class="fa-solid fa-house fa-lg"></i>',
    Transportation: '<i class="fa-solid fa-van-shuttle fa-lg"></i>',
    Entertainment: '<i class="fa-solid fa-face-grin-beam fa-lg"></i>',
    Food: '<i class="fa-solid fa-utensils fa-lg"></i>',
    Other: '<i class="fa-solid fa-pen fa-lg"></i>'
  }
  const userId = req.user._id
  // populate()可以將不同的表格關聯在一起
  // populate('原表格的關聯屬性名稱','查詢外部表格的屬性名稱'(optional)) 
  Record.find({ userId })
    .populate('categoryId','name')
    .lean()
    .then(records => {
      let totalAmount = 0
      // 處理日期格式和新增 categoryIcon 
      records = records.map(record => {
        record.date = record.date.toISOString().split('T')[0]
        record.categoryIcon = CATEGORY[record.categoryId.name]
        totalAmount += record.amount
        return record
      })
      res.render('index', { records, totalAmount })
    })
})

module.exports = router