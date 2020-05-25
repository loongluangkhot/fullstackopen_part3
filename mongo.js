const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password> <entry:name> <entry:number>');
  process.exit(1);
}
const password = process.argv[2];
const collection = "fullstackopen_phonebook";
const url = `mongodb+srv://luangkhn_db1:${password}@cluster0-fo3zv.mongodb.net/${collection}?retryWrites=true&w=majority`;
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Entry = mongoose.model("Entry", entrySchema);

if(process.argv[3] && process.argv[4]) {
  const newEntry = new Entry({
    name: process.argv[3],
    number: process.argv[4]
  });
  newEntry.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Entry.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach(entry => console.log(`${entry.name} ${entry.number}`));
    mongoose.connection.close();
  });
}