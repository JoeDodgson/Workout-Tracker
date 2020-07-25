const API = {
  async getLastWorkout() {
    let res;
    try {
      // Get request to retrieve workouts data
      res = await fetch("/api/workouts");
      
      // Read the response and return the final workout
      const json = await res.json();
      return json[json.length - 1];
      
    } catch (err) {
      console.log(`ERROR - api.js - getLastWorkout(): ${err}`)
    }
  },
  async addExercise(data) {
    // Store the workout ID from the URL
    const id = location.search.split("=")[1];
    try {
      // Put request to update workout data using the workout ID from the URL
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
