const express = require('express')
const { engine }  = require('express-handlebars')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Record = require('./models/record')
const Category = require('./models/category')
const User = require('./models/user')

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
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.get('/', (req, res) => {
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
app.get('/expenses/new', (req, res) => {
  res.render('new')
})
app.post('/expenses', async (req, res) => {
  const { name, date, category, amount } = req.body
  Promise.all([
    Category.findOne({name: category}).lean(),
    User.create({name: 'test', email: 'test@example.com', password: '12345'}),
  ])
  .then(([category, user]) => {
    const userId = user._id
    const categoryId = category._id
    return Record.create({
      name,
      date,
      amount,
      categoryId,
      userId
    })
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(error => console.log(error))
  // try {
  //   const { name, date, category, amount } = req.body
  //   const categoryDoc = await Category.findOne({ name: category })
  //   const userId = await User.create({
  //     name: 'test',
  //     email: 'test@example.com',
  //     password: '12345'
  //   })
  //   Record.create({
  //     name,
  //     date,
  //     amount,
  //     userId: userId._id,
  //     categoryId: categoryDoc._id
  //   })
  //   res.redirect('/')
  // } catch (error) {
  //   console.log(error)
  // }
})
app.get('/expenses/:id/edit', async(req, res) => {
  const _id = req.params.id
  Promise.all([
    Category.find().lean(),
    Record.findOne({ _id }).populate('categoryId').lean()
  ])
  .then(([categories, record]) => {
    const categoryOptions = categories.map(category => ({
      name: category.name,
      isSelected: category.name === record.categoryId.name
    }))
    record.date = record.date.toISOString().split('T')[0]
    res.render('edit', {record, categoryOptions})
  })
  .catch(error => console.log(error))
  // await/async的寫法
  // try{
  //   const _id = req.params.id
  //   const categories = await Category.find().lean()
  //   const record = await Record.findOne({_id }).populate('categoryId').lean()
  //   const categoryOptions = categories.map(category => ({
  //     name: category.name,
  //     isSelected: category.name === record.categoryId.name
  //   }))
  //   record.date = record.date.toISOString().split('T')[0]
  //   res.render('edit', {record, categoryOptions})
  // } catch (error) {
  //   console.log(error)
  // }
})
app.put('/expenses/:id', async (req, res) => {
  const { name, date, category, amount } = req.body
  const _id = req.params.id
  Promise.all([
    Category.findOne({name: category}).lean(),
    Record.findOne({_id})         // 這邊不能加 lean()
  ])
  .then(([category, record]) => {
    const categoryId = category._id
    record.name = name
    record.date = date
    record.amount = amount
    record.categoryId = categoryId
    return record.save()
  })
  .then(() => {
    res.redirect('/')
  })
  .catch(error => console.log(error))
  // aync/await
  // try {
  //   const { name, date, category, amount } = req.body
  //   const _id = req.params.id
  //   const categoryDoc = await Category.findOne({name: category})
  //   const record = await Record.findById( {_id} )
  //   record.name = name,
  //   record.date = date,
  //   record.categoryId = categoryDoc._id,
  //   record.amount = amount
  //   await record.save()
  //   res.redirect('/')
  // } catch (error) {
  //   console.log(error)
  // }  
})
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}`)
})

