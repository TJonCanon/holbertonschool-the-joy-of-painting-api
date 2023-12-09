const createDBConnect = require('./dbConnect');

async function populateDatabase() {
  try {
  
    const db = createDBConnect();

    
    data.forEach((row) => {
      db.query(`INSERT INTO ... VALUES ...`, (error, results, fields) => {
        if (error) throw error;

      });
    });

    db.end();
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

module.exports = populateDatabase;