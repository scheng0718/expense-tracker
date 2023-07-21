const express = require('express')
const router = express.Router()
const Record = require('../../models/record')

// 首頁內容顯示所有支出費用
router.get('/', (req, res) => {
  // 載入 icon 圖檔
  const CATEGORY = {
    家居物業: '<i class="fa-solid fa-house fa-lg"></i>',
    交通出行: '<i class="fa-solid fa-van-shuttle fa-lg"></i>',
    休閒娛樂: '<i class="fa-solid fa-face-grin-beam fa-lg"></i>',
    餐飲食品: '<i class="fa-solid fa-utensils fa-lg"></i>',
    其他: '<i class="fa-solid fa-pen fa-lg"></i>'
  }
  // populate()可以將不同的表格關聯在一起
  // populate('原表格的關聯屬性名稱','查詢外部表格的屬性名稱'(optional)) 
  Record.find()
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