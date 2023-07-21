const db = require('../../config/mongoose')
const Category = require('../category')
const SEED_CATEGORY = [
  {
    id: 1,
    name: '家居物業'
  },
  {
    id: 2,
    name: '交通出行'
  },
  {
    id: 3,
    name: '休閒娛樂'
  },
  {
    id: 4,
    name: '餐飲食品'
  },
  {
    id: 5,
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