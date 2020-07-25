// Require in node modules
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Configure dotenv
dotenv.config();

// Require in local modules
const Models = require("./models/workoutModel.js");

// Define DB connection details
const PORT = process.env.PORT || 3000;

// Set up the express server and middleware
const app = express();
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the public folder to the front end
app.use(express.static("public"));

// Connect to mongoDB database using Mongoose
// Connect to local workout Mongo database using mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
  useFindAndModify: false
});

// Require in routes
require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);

// Start the application server listening 
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
