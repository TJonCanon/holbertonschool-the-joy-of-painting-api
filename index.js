const checkDB = require('./source/checkDB');

checkDB()
    .then((exists) => {
        if(!exists) {
            const createDB = fs.readFileSync(
                path.join(__dirname, './sql/createDB.sql'),
                'utf-8'
                );

        // create connection
        const db = createDBconnectNoDB();

        // create database
        db.query(createDB, (error, results, fields) => {
            if (error) {
                console.log("Error occured, no database created: ", error);
                db.end();
                return;
            }

            console.log("Database created");
            db.end();
        });

        loadData();
        
        } else {
            consle.log("Database exists")
        }
        })
        .then(() => {
            const app = express();
            const port = 5000;

            const connection = createDBConnect();

            app.get("/api/episodes/search", async (req, res) => {
                const { month, subject, color, matchType } = req.query;

                let filters = [];
                if (month) filters.push(`month = ${connection.esacpe(month)}`);
                if (subject) filters.push(`s.subject_name = ${connection.escape(subject)}`);
                if (color) filters.push(`c.color_name = ${connection.escape(color)}`);

                let filterString = filters.join(
                    matchType.toUpperCase() === "ALL" ? " AND " : " OR "
                  );

                  let sql = `
                  SELECT e.episode_title
                  FROM Episodes e 
                  LEFT JOIN Episode_Subject es ON e.episode_id = es.Episode_Id
                  LEFT JOIN Subjects s ON es.Subject_Id = s.Subject_Id
                  LEFT JOIN Episode_Color ec ON e.episode_id = ec.Episode_Id
                  LEFT JOIN Colors c ON ec.Color_Id = c.Color_Id
                `;
                if (filterString) sql += `WHERE ${filterString}`;

                connection.query(sql, (error, results) => {
                if (error) throw error;
                res.json(results);
            });
        });

                app.listen(port, () => {
                    console.log(`API is running at http://localhost:${port}`);
        });

                process.on("SIGINT", () => {
                connection.end();
                process.exit();
            });
        })
        .catch((err) => {
            console.log("An error occurred: ", err);
        });
