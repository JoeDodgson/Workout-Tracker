// Require in node modules
const express = require("express");
const mongoose = require("mongoose");

// Require in local modules
const User = require("/models/index.js");

// Define DB connection details
const PORT = process.env.PORT || 3000;

// Set up the express server and middleware
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the public folder to the front end
app.use(express.static("public"));

// Connect to mongoDB database using Mongoose
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/userdb", { useNewUrlParser: true });

// Require in routes
require('./routes/html-routes.js')(app);
require('./routes/api-routes.js')(app);

// Start the application server listening 
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
