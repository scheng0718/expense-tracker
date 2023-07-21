const express = require('express')
const router = express.Router()
const Record = require('../../models/record')
const Category = require('../../models/category')

// get create page
router.get('/new', (req, res) => {
  res.render('new')
})
// submit create page
router.post('/', async (req, res) => {
  const { name, date, category, amount } = req.body
  const userId = req.user._id
  
  Category.findOne({name: category})
    .lean()
    .then(category => {
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
  // await/async style
  // try {
  //   const { name, date, category, amount } = req.body
  //   const categoryDoc = await Category.findOne({ name: category })
  //   const userId = req.user._id
  //   Record.create({
  //     name,
  //     date,
  //     amount,
  //     userId,
  //     categoryId: categoryDoc._id
  //   })
  //   res.redirect('/')
  // } catch (error) {
  //   console.log(error)
  // }
})
// get a page for editing one expense
router.get('/:id/edit', async(req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Promise.all([
    Category.find().lean(),
    Record.findOne({ _id, userId }).populate('categoryId').lean()
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
  // await/async style
  // try{
  //   const _id = req.params.id
  //   const userId = req.user._id
  //   const categories = await Category.find().lean()
  //   const record = await Record.findOne({ _id, userId }).populate('categoryId').lean()
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
// submit edit page
router.put('/:id', async (req, res) => {
  const { name, date, category, amount } = req.body
  const _id = req.params.id
  const userId = req.user._id
  Promise.all([
    Category.findOne({name: category}).lean(),
    Record.findOne({ _id, userId })         // 這邊不能加 lean()
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
  // aync/await style
  // try {
  //   const { name, date, category, amount } = req.body
  //   const _id = req.params.id
  //   const userId = req.user._id
  //   const categoryDoc = await Category.findOne({name: category})
  //   const record = await Record.findOne({ _id, userId })
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
// delete one expense
router.delete('/:id', async (req, res) => {
  const _id = req.params.id
  const userId = req.user._id
  Record.findByIdAndDelete({ _id, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
  // async/ await  
  // try {
  //   const _id = req.params.id
  //   const userId = req.user._id
  //   await Record.findByIdAndDelete({ _id, userId })
  //   res.redirect('/')
  // } catch (error) {
  //   console.log(error)
  // }
})

module.exports = router