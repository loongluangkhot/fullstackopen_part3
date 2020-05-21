const express = require('express');
const morgan = require("morgan");
const cors = require("cors");
const app = express();

morgan.token('http-post-req-body', function(req) {
  if(req.method === "POST") return JSON.stringify(req.body);
  return " ";
});

app.use(cors());
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :http-post-req-body"));
app.use(express.json());

const data = {
  "persons": [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]
}

app.get("/api/persons", (req, res) => {
  res.json(data.persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const person = data.persons.find(person => person.id === id);
  if(person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(data.persons);
  data.persons = data.persons.filter(person => person.id !== id);
  console.log(data.persons);
  res.status(204).end();
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  
  if(!body.name || !body.number) {
    return res.status(400).json({
      error: "Both name and number must be provided!"
    });
  }

  const personExists = data.persons.find(person => person.name === body.name);
  if(personExists) {
    return res.status(400).json({
      error: "Name must be unique!"
    });
  }
  const personToAdd = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 1e6)
  };
  data.persons.push(personToAdd);
  res.json(personToAdd);
});

app.get("/info", (req, res) => {
  res.send(`
    <p>Phonebook has info for ${data.persons.length} people</p>
    <p>${new Date()}</p>
  `);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

