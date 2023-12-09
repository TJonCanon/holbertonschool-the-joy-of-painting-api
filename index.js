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
