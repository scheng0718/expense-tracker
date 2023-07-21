const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')
const User = require('../../models/user')
// 取得新增支出表單頁面
router.get('/new', (req, res) => {
  res.render('new')
})
// 送出新增支出表單內容
router.post('/', async (req, res) => {
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
  // await/async 風格
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
// 取得編輯支出費用頁面
router.get('/:id/edit', async(req, res) => {
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
// 修改編輯表單內容
router.put('/:id', async (req, res) => {
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
// 刪除特定支出費用
router.delete('/:id', async (req, res) => {
  const _id = req.params.id
  Record.findByIdAndDelete({_id})
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
  // async/ await  
  // try {
  //   const _id = req.params.id
  //   await Record.findByIdAndDelete({_id})
  //   res.redirect('/')
  // } catch (error) {
  //   console.log(error)
  // }
})

module.exports = router