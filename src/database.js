const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/examplejwt", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log("Database is connected"))
  .catch((error) => handleError(error));
