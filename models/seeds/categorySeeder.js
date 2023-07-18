const mongoose = require('mongoose')
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

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI)
const db = mongoose.connection
db.on('error', () => {
  console.log('mongodb error!')
})
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