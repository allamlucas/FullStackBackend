const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express();
app.use(express.static('dist'))

app.use(cors())
app.use(express.json()); 
app.use(morgan('tiny'));

let persons = require('./persons.json');

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    response.send(
        `<div>
  <p>phonebook has info for ${persons.length} persons</p>
  <p>${Date()}</p>
  </div>`
    )
})


app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const persona = persons.find(persona => persona.id === id)
    if (persona) {
      response.json(persona)
    } else {
      response.status(404).end()
    }
  })


  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persona => persona.id !== id)
  
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    const persona = request.body
    if (!persona.name || !persona.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }if(persons.find((nombre)=> nombre.name === persona.name)){
        return response.status(400).json({
            error: 'NAME EXISTING'
        })      
    }else
    persona.id = Math.floor(Math.random() * 10000)
    persons = persons.concat(persona)
    response.json(persona)
})
  


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
