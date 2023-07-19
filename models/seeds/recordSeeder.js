const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Record = require('../record')
const User = require('../user')
const Category = require('../category')
const SEED_USER = [
  {
    id: 1,
    name: '廣志',
    email: 'user1@example.com',
    password: '1234abcd'
  },
  {
    id: 2,
    name: '小新',
    email: 'user2@example.com',
    password: '1234abcd'
  }
]
const SEED_RECORD = [
  {
    id: 1,
    name: '午餐',
    date: '2023.7.15',
    amount: 60
  },
  {
    id: 2,
    name: '晚餐',
    date: '2023.7.16',
    amount: 60
  },
  {
    id: 3,
    name: '捷運',
    date: '2023.7.16',
    amount: 120
  },
  {
    id: 4,
    name: '電影：驚奇隊長',
    date: '2023.7.18',
    amount: 220
  },
  {
    id: 5,
    name: '租金',
    date: '2023.7.01',
    amount: 25000
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
db.once('open', async() => {
  console.log('mongodb connected!')
  Promise.all(SEED_USER.map(async user => {
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)
    return User.create({
      id: user.id,
      name: user.name,
      email: user.email,
      password: hash
    })
  }))
  .then(async users => {
    const category = await Category.find().lean()
    SEED_RECORD[0].userId = users[0]._id
    SEED_RECORD[0].categoryId = category[3]._id
    SEED_RECORD[1].userId = users[0]._id
    SEED_RECORD[1].categoryId = category[3]._id
    SEED_RECORD[2].userId = users[0]._id
    SEED_RECORD[2].categoryId = category[1]._id
    SEED_RECORD[3].userId = users[1]._id
    SEED_RECORD[3].categoryId = category[2]._id
    SEED_RECORD[4].userId = users[0]._id
    SEED_RECORD[4].categoryId = category[0]._id
    await Record.insertMany(SEED_RECORD)
  })
  .then(() => {
    console.log('Record data done!')
    process.exit()
  })
  .catch(error => {
    console.log(error)
    process.exit(1)
  })
})