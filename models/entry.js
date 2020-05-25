const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const url = process.env.MONGODB_URI;
console.log("connecting to", url);
mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: [3, "Name needs to contain at least 3 characters!"],
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        const matches = v.match(/\d/g);
        return matches && matches.length >= 8;
      },
      message: (props) => "Phone number needs to contain at least 8 digits!",
    },
  },
});

entrySchema.plugin(uniqueValidator);

entrySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Entry", entrySchema);
