// Require in dependencies
// const fs = require("fs");
const path = require("path");

// Require in local modules
// const db = require('./models/workoutModel.js');

// Define paths
const indexHTMLPath = path.join(__dirname, "../public/index.html");
const exerciseHTMLPath = path.join(__dirname, "../public/exercise.html");
const statsHTMLPath = path.join(__dirname, "../public/stats.html");

module.exports = (app) => {
    // Root page
    app.get('/', (req, res) => {
        res.sendFile(indexHTMLPath);
    });

    // Exercise page
    app.get('/exercise', (req, res) => {
        res.sendFile(exerciseHTMLPath);
    });

    // Stats page
    app.get('/stats', (req, res) => {
        res.sendFile(statsHTMLPath);
    });
};
