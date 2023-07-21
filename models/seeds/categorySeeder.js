const db = require('../../config/mongoose')
const Category = require('../category')
const SEED_CATEGORY = [
  {
    name: '家居物業'
  },
  {
    name: '交通出行'
  },
  {
    name: '休閒娛樂'
  },
  {
    name: '餐飲食品'
  },
  {
    name: '其他'
  }
]

db.once('open', async () => {
  console.log('mongodb connected!')
  try {
    await Category.insertMany(SEED_CATEGORY)
    console.log('category data done!')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
})