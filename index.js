const express = require('express')
const app = express()

const cors = require('cors')
var morgan = require('morgan')
let persons = require('./persons.json');

app.use(express.json());
app.use(morgan('tiny'))
app.use(cors())

app.get('/', function (req, res) {
  res.send('hello, world!')
})

app.post('/', function (req, res) {
 console.log(req.body);
})

app.get('/info', (request, response) => {
  let now = new Date()
    response.send(`<h1> Phonebook has ${persons.length} people <h1/> \n${ now}`) 
  })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
  })

  app.get('/api/persons', (request, response) => {
      response.json(persons)
  })

  const generateId = () => {
    return Math.floor(Math.random() * 1000000) + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number ) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  if (!!persons.find(person => person.name == body.name)) {
    return response.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  app.use(unknownEndpoint)
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })


