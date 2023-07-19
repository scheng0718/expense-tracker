const express = require('express')
const { engine }  = require('express-handlebars')
const mongoose = require('mongoose')
const Record = require('./models/record')
const Category = require('./models/category')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const app = express()
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
db.once('open', () => {
  console.log('mongodb connected!')
})
const port = 3000
app.engine('hbs', engine({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use('/', (req, res) => {
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
        let date = record.date
        let year = date.getFullYear().toString()
        let month = ((date.getMonth() + 1).toString().padStart(2, '0'))
        let day = date.getDate().toString().padStart(2, '0')
        record.date = year + '-' + month + '-' + day
        record.categoryIcon = CATEGORY[record.categoryId.name]
        totalAmount += record.amount
        return record
      })
      res.render('index', { records, totalAmount })
    })
})

app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})

