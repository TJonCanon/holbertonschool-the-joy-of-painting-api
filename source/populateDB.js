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

  const colors = papa.parse(colorData, { header: true }).data;
  const episodes = papa.parse(episodeData, { header: true }).data;
  const subjects = papa.parse(subjectData, { header: true }).data;

  const colorNames = Object.keys(colors[0]).filter(
  (key) =>
    key !== "" &&
    key !== "painting_index" &&
    key !== "img_src" &&
    key !== "painting_title" &&
    key !== "season" &&
    key !== "episode" &&
    key !== "num_colors" &&
    key !== "youtube_src" &&
    key !== "colors" &&
    key !== "color_hex"
    );

    const subjectNames = Object.keys(subjects[0]).filter(
      (header) => header !== "EPISODE" && !=="TITLE"
    );

    const db = createDBConnect();

    const query = util.promisify(db.query).bind(db);

    const colorPromises = colorNames.map((colorName)) => {
      const sql = "INSERT INTO COLORS (Color_Name) VALUES (?)";
      return query(sql, [colorName])
        .then(() =>
        console.log(
          'Inserted color ${colorName} sucessfully into the database'
          )
        )
        .catch((error) => {
          console.log('Did not insert color ${colorName} into database due to error');
          throw error;
        });
    }
}

module.exports = populateDatabase;