// Require in models
const db = require('../models');

module.exports = (app) => {
    // Get last workout
    // Needs to return an array of user's workouts in order of least recent to most recent  _id
    app.get('/api/workouts', async (req, res) => {
        try {
            // Do a find all query on the database
            const workouts = await db.Workout.find({});

            // If no workouts are returned, throw a 404 error
            if (workouts.length === 0) throw new Error('404: No workouts found');

            // Return the workouts to the user
            return res.json(workouts);
        } catch (err) {
            console.error(`ERROR - api-routes.js - .get('/api/workouts'): ${err}`);
        }
    });
}


