const API = {
  async getLastWorkout() {
    let res;
    try {
      // Send a get request to retrieve workouts data
      res = await fetch("/api/workouts");
      
      // Read the response and return the last workout
      const json = await res.json();

      // If workouts get request response returns nothing, return false
      if (json.length === 0) return false;
      
      const lastWorkout = json[json.length - 1];

      // If no exercises in the last workout, return false
      if (lastWorkout.exercises.length === 0) return false;
      
      return lastWorkout;
      
    } catch (err) {
      console.log(`ERROR - api.js - getLastWorkout(): ${err}`)
    }
  },

  // Sends a put request to insert exercise data into a workout using the workout ID from the URL
  async addExercise(data) {
    // Store the workout ID from the URL
    const id = location.search.split("=")[1];
    try {
      // Use the data passed into the function as the body of the put request
      const res = await fetch("/api/workouts/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      // Read and return the whole response
      const json = await res.json();
      return json;
      
    } catch (err) {
      console.log(`ERROR - api.js - addExercise(): ${err}`)
    }
    
  },

  // Send a post request to create a new workout with no exercise data
  async createWorkout() {
    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      
      // Read and return the whole response
      const json = await res.json();
      return json;
      
    } catch (err) {
      console.log(`ERROR - api.js - createWorkout(): ${err}`)
    }
  },
  
  async getWorkoutsInRange() {
    try {
      // Get request to retrieve workouts range data
      const res = await fetch(`/api/workouts/`);
  
      // Read and return the whole response
      const json = await res.json();
      return json;

    } catch (err) {
      console.log(`ERROR - api.js - getWorkoutsInRange(): ${err}`)
    }
  },
};
