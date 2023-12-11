const fs = require("fs");
const path = require("path");
const papa = require("papaparse")
const util = require("util");
const dbConnect = require('./dbConnect');

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
    path.join(__dirname, "../datasets/Subjects.csv"),
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
      (header) => header !== "EPISODE" && header !=="TITLE"
    );

    const db = dbConnect();

    const query = util.promisify(db.query).bind(db);

    const colorPromises = colorNames.map((colorName) => {
      const sql = "INSERT INTO Colors (Color_Name) VALUES (?)";
      return query(sql, [colorName])
        .then(() =>
          console.log(
            `Successfully inserted color ${colorName} into the database.`
          )
        )
        .catch((error) => {
          console.log(`Failed to insert color ${colorName} into the database.`);
          throw error;
        });
    });

    const subjectPromises = subjectNames.map((subjectName) => {
      const sql = "INSERT INTO Subjects (Subject_Name) VALUES (?)";
      return query(sql, [subjectName])
        .then(() =>
          console.log(
            `Successfully inserted subject ${subjectName} into the database.`
          )
        )
        .catch((error) => {
          console.log(
            `Failed to insert subject ${subjectName} into the database.`
          );
          throw error;
        });
    });

    const episodePromises = episodes.map(async (episodeData, index) => {
      const title = episodeData.TITLE;
      const month = episodeData.DATE.replace(/ "/g, "").split(" ")[0];
      const season = colors[index].season; // assuming colors and episodes are in the same order
      const episode = colors[index].episode; // assuming colors and episodes are in the same order
  
      const sql =
        "INSERT INTO Episodes (episode_title, season, episode, month) VALUES (?, ?, ?, ?)";
      try {
        const result = await query(sql, [title, season, episode, month]);
        console.log(`Successfully inserted episode ${title} into the database.`);
        const episodeId = result.insertId;

        const colorPromises = colorNames.map(async (colorName) => {
          if (colors[index][colorName] == "1") {

            const sqlColorId = "SELECT Color_Id FROM Colors WHERE Color_Name = ?";
            const resultColor = await query(sqlColorId, [colorName]);
            const colorId = resultColor[0].Color_Id;

            const sqlAssociationColor =
              "INSERT INTO Episode_Color (Episode_Id, Color_Id) VALUES (?, ?)";
            await query(sqlAssociationColor, [episodeId, colorId]);
            console.log(
              `Successfully associated color ${colorName} with episode ${title}.`
            );
          }
        });

        const subjectPromises = subjectNames.map(async (subjectName) => {
          if (subjects[index][subjectName] == "1") {

            const sqlSubjectId =
              "SELECT Subject_Id FROM Subjects WHERE Subject_Name = ?";
            const resultSubject = await query(sqlSubjectId, [subjectName]);
            const subjectId = resultSubject[0].Subject_Id;
  
            const sqlAssociationSubject =
              "INSERT INTO Episode_Subject (Episode_Id, Subject_Id) VALUES (?, ?)";
            await query(sqlAssociationSubject, [episodeId, subjectId]);
            console.log(
              `Successfully associated subject ${subjectName} with episode ${title}.`
            );
          }
        });
        await Promise.all([...colorPromises, ...subjectPromises]);
      } catch (error) {
        console.log(`Failed to insert episode ${title} into the database.`);
        throw error;
      }
    });
  
    Promise.all([...colorPromises, ...subjectPromises, ...episodePromises])
      .then(() => db.end())
      .catch((error) =>
        console.error("Error during database insertions:", error)
      );
  }
  
module.exports = populateDatabase;