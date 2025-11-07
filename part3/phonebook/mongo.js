const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://1419058808_db_user:${password}@cluster0.vjlpdsv.mongodb.net/?appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const name = process.argv[3]
const number = process.argv[4]

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const person = new Person({
    name,
    number,
  })
  person.save().then(() => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else if (process.argv.length === 3) {
  Person
    .find({})
    .then(persons => {
      console.log('phonebook:')
      const info = persons.map(p => `${p.name} ${p.number}`)
      console.log(info.join('\n'))
      mongoose.connection.close()
    })
} else {
  console.log(
    'Notice:\n' +
    '  node mongo.js <password>, or\n' +
    '  node mongo.js <password> <name> <number>\n'
  )
  mongoose.connection.close()
}
