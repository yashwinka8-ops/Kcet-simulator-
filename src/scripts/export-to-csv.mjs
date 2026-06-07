import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDataPath = path.join(__dirname, '../lib/cutoff-data.json');
const outputPath = path.join(__dirname, '../lib/cutoff-pivoted.csv');

function exportToCSV() {
    console.log('Loading raw data...');
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    console.log(`Loaded ${rawData.length} rows.`);

    const pivoted = new Map();

    console.log('Pivoting data...');
    for (const row of rawData) {
        // Create a unique key for grouping (everything except round and closing_rank)
        const key = `${row.college_id}|${row.branch_id}|${row.category}|${row.gender}|${row.year}|${row.hk_quota}`;
        
        if (!pivoted.has(key)) {
            pivoted.set(key, {
                college_id: row.college_id,
                short_name: row.college_name.split(' ')[0], // Best effort short name
                city: row.city,
                branch_id: row.branch_id,
                branch_name: row.branch_name,
                category: row.category,
                gender: row.gender,
                year: row.year,
                hk_quota: row.hk_quota,
                round_1: '--',
                round_2: '--',
                round_3: '--',
                college_type: row.college_type,
                fees: row.fees,
                avg_package: row.avg_package,
                highest_package: row.highest_package,
                naac_grade: row.naac_grade
            });
        }

        const entry = pivoted.get(key);
        if (row.round === 1) entry.round_1 = row.closing_rank;
        else if (row.round === 2) entry.round_2 = row.closing_rank;
        else if (row.round === 3) entry.round_3 = row.closing_rank;
    }

    console.log(`Pivoting complete. ${pivoted.size} unique combinations.`);

    const headers = [
        'college_id', 'short_name', 'city', 'branch_id', 'branch_name', 
        'category', 'gender', 'year', 'hk_quota', 'round_1', 'round_2', 'round_3', 
        'college_type', 'fees', 'avg_package', 'highest_package', 'naac_grade'
    ];

    const csvRows = [headers.join(',')];

    for (const entry of pivoted.values()) {
        const row = headers.map(h => {
            let val = entry[h];
            // Handle commas in names for CSV safety
            if (typeof val === 'string' && val.includes(',')) {
                return `"${val}"`;
            }
            return val;
        });
        csvRows.push(row.join(','));
    }

    console.log('Writing CSV file...');
    fs.writeFileSync(outputPath, csvRows.join('\n'));
    console.log(`CSV export complete: ${outputPath}`);
}

exportToCSV();
