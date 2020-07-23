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
  let durations = duration(data);
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
      labels: durations.dates[0],
      datasets: [
        {
          label: "Exercise Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: durations.durations[0],
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
              max: Math.max(...durations.durations[0])
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
      labels: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      datasets: [
        {
          label: "Pounds",
          data: pounds,
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
              beginAtZero: true
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
          data: durations
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
const duration = data => {
  const dates = [];
  const durations = [];
  
  // Store the date and duration for each workout
  data.forEach(workout => {
    // Take the date as the first 10 characters of the workout day, i.e. DD/MM/YYYY
    const date = workout.day.substring(0, 10);
    workout.exercises.forEach(exercise => {
      dates.push(date);
      durations.push(exercise.duration);
    });
  });
  
  // Remove all but the last 7 workouts
  const recentDurations = {};
  recentDurations.dates = [dates.splice(dates.length - 7, 7)];
  recentDurations.durations = [durations.splice(durations.length - 7, 7)];
  return recentDurations;
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
