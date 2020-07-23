// Get all workout data from back-end
  
const fetchStats = async () => {
  try {
    res = await API.getWorkoutsInRange();
    populateChart(res);

  } catch (err) {
    console.error(`ERROR - stats.js - fetchStats(): ${err}`);
  }
}

fetchStats();

const generatePalette = () => {
  const arr = [
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600",
    "#003f5c",
    "#2f4b7c",
    "#665191",
    "#a05195",
    "#d45087",
    "#f95d6a",
    "#ff7c43",
    "ffa600"
  ]

  return arr;
}

// Populates all 4 charts in the stats dashboard with data retrieved from the database
const populateChart = data => {
  let recentWorkouts = recentWorkoutData(data, 7);
  let pounds = calculateTotalWeight(data);
  let workouts = workoutNames(data);
  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  // Creates a line chart for displaying exercise duration for past 7 exercises
  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: recentWorkouts.dates[0],
      datasets: [
        {
          label: "Exercise Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: recentWorkouts.durations[0],
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "Duration of Last 7 Workouts"
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              max: Math.max(...recentWorkouts.durations[0])
            },
            display: true,
            scaleLabel: {
              display: true
            }
          }
        ]
      }
    }
  });

  // Creates a bar chart to display the total weight lifted over the last 7 exercises
  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: recentWorkouts.dates[0],
      datasets: [
        {
          label: "Pounds",
          data: recentWorkouts.totalWeight[0],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Pounds Lifted During Last 7 Workouts"
      },
      legend: {
        display: false
      },
      scales: {
        yAxes: [
          {
            ticks: {
              min: 0,
              max: Math.max(...recentWorkouts.totalWeight[0])
            }
          }
        ]
      }
    }
  });
  
  // Creates a pie chart to display the split of exercise performed over all time
  let pieChart = new Chart(pie, {
    type: "pie",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: recentWorkouts
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed"
      }
    }
  });
  
  // Creates a donut chart to display the split of exercise performed over all time
  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: workouts,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: pounds
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Excercises Performed"
      }
    }
  });
}

// Populate duration line graph using the date and the duration
const recentWorkoutData = (data, num) => {
  const dates = [];
  const durations = [];
  const totalWeight = [];
  
  // Store the date and duration for each workout
  data.forEach(workout => {
    // Take the date as the first 10 characters of the workout day, i.e. DD/MM/YYYY
    const date = workout.day.substring(0, 10);
    dates.push(date);
    durations.push(0);
    totalWeight.push(0);
    workout.exercises.forEach(exercise => {
      durations[durations.length - 1] += exercise.duration;
      if (exercise.type === "resistance") {
        totalWeight[totalWeight.length - 1] += exercise.weight;
      }
    });
  });
  
  // Populate a 'recentWorkouts' object with the 'num' most recent workout dates and durations
  const recentWorkouts = {};
  if (dates.length > num) {
    recentWorkouts.dates = [dates.splice(dates.length - num, num)];
    recentWorkouts.durations = [durations.splice(durations.length - num, num)];
    recentWorkouts.totalWeight = [totalWeight.splice(totalWeight.length - num, num)];
  } else {
    recentWorkouts = { dates , durations , totalWeight };
  }
  return recentWorkouts;
}

// Returns an array of total weight for each exercise
const calculateTotalWeight = data => {
  let total = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      total.push(exercise.weight);
    });
  });

  return total;
}

// Returns an array of exercise names for all workouts
const workoutNames = data => {
  let workouts = [];

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      workouts.push(exercise.name);
    });
  });
  
  return workouts;
}
