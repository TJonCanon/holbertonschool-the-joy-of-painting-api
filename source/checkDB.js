const mysql = require('mysql');

function checkDB() {
    const db = createDBConnectNoDB();

    return new Promise((resolve, reject) => {
        db.query("SHOW DATABASE LIKE 'JoyOfPainting'", (error, results, fields) => {
            if (error) reject(error);

            db.end();

            results.length === 0 ? resolve(false) : resolve(true);
        });
    });
}

function createDBConnectNoDB() {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password_password',
        multipleStatements: true
    });

    connection.connect((error) => {
        if (error) {
            console.error('Error connecting to database: ' + error.stack);
            return;
          }
          console.log('Connected to database as id ' + connection.threadId);
        });
      
        return connection;
    }


module.exports = { checkDB, createDBConnectNoDB };
