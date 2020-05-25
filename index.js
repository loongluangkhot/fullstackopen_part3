require("dotenv").config();
const express = require("express");

const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Entry = require("./models/entry");

morgan.token("http-post-req-body", (req) => {
  if (req.method === "POST") return JSON.stringify(req.body);
  return " ";
});

app.use(cors());
app.use(express.json());
app.use(express.static("build"));
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :http-post-req-body",
  ),
);

app.get("/api/persons", (req, res) => {
  Entry.find({}).then((result) => {
    res.json(result);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Entry.findById(id)
    .then((result) => {
      if (!result) res.status(404).end();
      res.json(result);
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  const { body } = req;
  Entry.findOneAndUpdate({ _id: id }, { number: body.number }, { new: true })
    .then((result) => {
      if (!result) res.status(404).end();
      res.json(result);
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (req, res, next) => {
  const { id } = req.params;
  Entry.deleteOne({ _id: id })
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
  const { body } = req;
  const newEntry = new Entry({
    name: body.name,
    number: body.number,
  });
  newEntry
    .save()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => next(err));
});

app.get("/info", (req, res) => {
  Entry.find({}).then((result) => {
    res.send(`
      <p>Phonebook has info for ${result.length} people</p>
      <p>${new Date()}</p>
    `);
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res) => {
  console.log(err);
  res.status(400).send(err.message);
};
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
