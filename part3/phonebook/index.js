const express = require('express')
const app = express()

app.use(express.json())

app.use(express.static('dist'))

const morgan = require('morgan')

morgan.token('body', (request) => {
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return JSON.stringify(request.body)
  }
  return ''
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<h1>Phonebook is running</h1>')
})

let persons = [
  { 
    "id": "1",
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": "2",
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": "3",
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": "4",
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {
  const l = persons.length
  const reqtime = new Date()
  response.send(
    `<p>Phonebook has info for ${l} people</p>
     <p>${reqtime}</p>`
  )
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(p => p.id !== id)
  response.status(204).end()
})

const randomId = () => {
  let id
  while (true) {
    id = (Math.floor(Math.random() * 1_000_000_000)).toString()
    if (!persons.some(p => p.id === id)) 
        break
  }
  return id
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
        error: 'name and number are missing' 
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
        error: 'name must be unique' 
    })
  }

  const newPerson = {
    id: randomId(),
    name: body.name,
    number: body.number
  }

  persons = persons.concat(newPerson)
  response.status(201).json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
