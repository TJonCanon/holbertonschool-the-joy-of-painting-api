const fs = require("fs");
const path = require("path");
const Papa = require("papaparse")
const util = require("util");
const createDBConnect = require('./dbConnect');

function populateDatabase() {
  const colorData = fs.readFileSync(
    path.join(__dirname, "../datasets/Colors.csv"),
    "utf-8"
  );
  const episodeData = fs.readFileSync(
    path.join(__dirname, "../datasets/Episodes.csv"),
    "utf-8"
  );
  const subjectData = fs.readFileSync(
    path.join(__dirname, "../datasets/subjects.csv"),
    "utf-8"
  );
}

module.exports = populateDatabase;