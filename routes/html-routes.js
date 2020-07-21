// Require in dependencies
const fs = require("fs");
const path = require("path");

// Require in local modules
const db = require('/models');


// Define paths
const exerciseHTMLPath = path.join(__dirname, "/exercise.html");
const indexHTMLPath = path.join(__dirname, "/index.html");
const statsHTMLPath = path.join(__dirname, "/stats.html");


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
