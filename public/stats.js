// Declare variables
const titleFontSize = 18;

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
  let allWorkouts = allWorkoutData(data);
  const colors = generatePalette();

  let line = document.querySelector("#canvas").getContext("2d");
  let bar = document.querySelector("#canvas2").getContext("2d");
  let pie = document.querySelector("#canvas3").getContext("2d");
  let pie2 = document.querySelector("#canvas4").getContext("2d");

  // Creates a line chart for displaying exercise duration for past 7 exercises
  let lineChart = new Chart(line, {
    type: "line",
    data: {
      labels: recentWorkouts.dates,
      datasets: [
        {
          label: "Exercise Duration In Minutes",
          backgroundColor: "red",
          borderColor: "red",
          data: recentWorkouts.durations,
          fill: false
        }
      ]
    },
    options: {
      responsive: true,
      title: {
        display: true,
        fontSize: titleFontSize,
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
              display: true,
              labelString: "Date of workout"
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              max: Math.max(...recentWorkouts.durations)
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: "Duration (minutes)"
            }
          }
        ]
      }
    }
  });

  console.log(recentWorkouts);
  // Creates a bar chart to display the total weight lifted over the last 7 exercises
  let barChart = new Chart(bar, {
    type: "bar",
    data: {
      labels: recentWorkouts.dates,
      datasets: [
        {
          label: "Kilograms",
          data: recentWorkouts.totalWeight,
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
        fontSize: titleFontSize,
        text: "Total Weight Lifted During Last 7 Workouts"
      },
      legend: {
        display: false
      },
      scales: {
        xAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "Date of workout"
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              max: Math.max(...recentWorkouts.totalWeight),
              callback: (value, index, values) =>  `${value} kg`
            },
            scaleLabel: {
              display: true,
              labelString: "Total weight lifted in workout"
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
      labels: allWorkouts.distance.names,
      datasets: [
        {
          label: "Excercises Performed",
          backgroundColor: colors,
          data: allWorkouts.distance.totalDistance
        }
      ]
    },
    options: {
      title: {
        display: true,
        fontSize: titleFontSize,
        text: "Total distance per exercise (all time)"
      }
    }
  });
  
  // // Creates a donut chart to display the split of exercise performed over all time
  let donutChart = new Chart(pie2, {
    type: "doughnut",
    data: {
      labels: allWorkouts.weight.names,
      datasets: [
        {
          label: "Total weight per exercise (all time)",
          backgroundColor: colors,
          data: allWorkouts.weight.totalWeight
        }
      ]
    },
    options: {
      title: {
        display: true,
        fontSize: titleFontSize,
        text: "Total weight "
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
  let recentWorkouts = {};
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
const allWorkoutData = data => {
  const exerciseObj = {
    weight: {
      names: [],
      totalWeight: []
    },
    distance: {
      names: [],
      totalDistance: []
    }
  };

  data.forEach(workout => {
    workout.exercises.forEach(exercise => {
      if (exercise.type === "resistance") {
        const exerciseIndex = exerciseObj.weight.names.indexOf(exercise.name);
        if ( exerciseIndex === -1) {
          exerciseObj.weight.names.push(exercise.name);
          exerciseObj.weight.totalWeight.push(exercise.weight);
        }
        else {
          exerciseObj.weight.totalWeight[exerciseIndex] += exercise.weight;
        }
      } else if (exercise.type === "cardio") {
        const exerciseIndex = exerciseObj.distance.names.indexOf(exercise.name);
        if ( exerciseIndex === -1) {
          exerciseObj.distance.names.push(exercise.name);
          exerciseObj.distance.totalDistance.push(exercise.distance);
        }
        else {
          exerciseObj.distance.totalDistance[exerciseIndex] += exercise.distance;
        }
      }
    });
  });

  return exerciseObj;
}
