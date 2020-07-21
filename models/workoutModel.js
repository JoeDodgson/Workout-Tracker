// Require in node modules
const mongoose = require("mongoose");

// store the mongoose Schema property as a variable
const { Schema }  = mongoose;

// Define the workout schema
const WorkoutSchema = new Schema({
  day: {
    type: Date,
    required: true
  },
  exercises: {
    type: Array,
    required: true
  }
});

// Convert the schema into a model which can be used
const Workout = mongoose.model("workout", WorkoutSchema);

// Export the model to be used in other files
module.exports = Workout;
