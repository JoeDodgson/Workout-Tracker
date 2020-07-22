// Require in models
const db = require('../models');

module.exports = (app) => {
    // Returns an array of user's workouts in order of least recent to most recent
    app.get('/api/workouts', async (req, res) => {
        try {
            // Perform a find all query on the database
            const workouts = await db.Workout.find({});

            // If no workouts are returned, throw a 404 error
            if (workouts.length === 0) throw new Error('404: No workouts found');

            // Return the workouts to the user
            return res.json(workouts);
        } catch (err) {
            console.error(`ERROR - api-routes.js - .get('/api/workouts'): ${err}`);
        }
    });

    app.put('/api/workouts/:id', async (req, res) => {
        try {
            // Store the data sent in the request
            const { id } = req.query;
            const { type } = req.body;
            
            // Create a new workout document using the mongoose model
            const newWorkout = new db.Workout({
                day: new Date(),
                exercises: []
            });
            
            // Store the data sent in the request body and feed into the newWorkout
            if (type === "resistance") {
                const { name, duration, weight, reps, sets } = req.body;
                newWorkout.exercises.push({
                        _id: id,
                        type,
                        name,
                        duration,
                        weight,
                        reps,
                        sets
                });
            } else if (type === "cardio") {
                const { name, distance, duration } = req.body;
                newWorkout.exercises.push({
                        _id: id,
                        type,
                        name,
                        distance,
                        duration
                });
            }

            // Save the new workout to the database
            const addedWorkout = await newWorkout.save();

            // If no workout added, throw a  error
            if (!addedWorkout) throw new Error('501: Workout not added');
 
            // Return the workouts to the user
            return res.json(addedWorkout);

        } catch (err) {
            console.error(`ERROR - api-routes.js - .put('/api/workouts/:id'): ${err}`);
        }
    });
}


