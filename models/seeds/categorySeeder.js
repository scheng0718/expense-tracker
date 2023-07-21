const db = require('../../config/mongoose')
const Category = require('../category')
const SEED_CATEGORY = [
  {
    name: 'Household'
  },
  {
    name: 'Transportation'
  },
  {
    name: 'Entertainment'
  },
  {
    name: 'Food'
  },
  {
    name: 'Other'
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