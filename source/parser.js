const fs = require('fs');
const csv = require('parser');

function parseCSV(filePath) {
    const data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => data.push (row))
        .on('end', () => resolve(data))
        .on('error', (error) => reject(error));
    });
}

module.exports = parseCSV;
