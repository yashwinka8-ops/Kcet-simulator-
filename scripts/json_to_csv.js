const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '../src/lib/data/all-rounds-sorted-cutoffs.json');
const CSV_PATH = path.join(__dirname, '../src/lib/data/all-rounds-sorted-cutoffs.csv');

const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

if (data.length === 0) {
    console.log('No data to write.');
    process.exit(0);
}

const headers = ['college_id', 'college_name', 'branch_id', 'category', 'round', 'cutoff'];

const csvRows = [];
// Add header row
csvRows.push(headers.join(','));

data.forEach(row => {
    const values = headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        // Escape quotes and wrap in quotes if there's a comma, newline, or quote
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
            return '"' + val.replace(/"/g, '""') + '"';
        }
        return val;
    });
    csvRows.push(values.join(','));
});

fs.writeFileSync(CSV_PATH, csvRows.join('\n'), 'utf8');
console.log('Successfully created CSV file at ' + CSV_PATH);
