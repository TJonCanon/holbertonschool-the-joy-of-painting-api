const createDBConnect = require('./dbConnect');

function checkDB() {
    const db = createDBConnect();

    return new Promise((resolve, reject) => {
        // check if db exists
        db.query("SHOW DATABASE LIKE 'JoyOfPainting'", (error, results, fields) => {
            if (error) reject(error);

            db.end();

            results.length === 0 ? resolve(false) : resolve(true);
        });
    });
}

module.exports = checkDB;
