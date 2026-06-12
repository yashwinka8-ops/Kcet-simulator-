const fs = require('fs');
const path = require('path');

const ALL_DATA_PATH = path.join(__dirname, '../src/lib/data/all_data.json');
const OUTPUT_PATH = path.join(__dirname, '../src/lib/data/all-rounds-sorted-cutoffs.json');

const data = JSON.parse(fs.readFileSync(ALL_DATA_PATH, 'utf8'));

const allCutoffs = [];

data.colleges.forEach(col => {
    if (!col.kcet_cutoffs) return;
    
    col.kcet_cutoffs.forEach(cutoffInfo => {
        const rounds = ['mock', 'r1', 'r2', 'r3'];
        
        rounds.forEach(round => {
            const cutoffVal = cutoffInfo[round];
            if (cutoffVal !== null && typeof cutoffVal === 'number' && cutoffVal >= 1000) {
                allCutoffs.push({
                    college_id: col.college_id,
                    college_name: col.full_name || col.name || '',
                    branch_id: cutoffInfo.branch_id,
                    category: cutoffInfo.category,
                    round: round,
                    cutoff: cutoffVal
                });
            }
        });
    });
});

// Sort ascending by cutoff
allCutoffs.sort((a, b) => a.cutoff - b.cutoff);

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allCutoffs, null, 2), 'utf8');
console.log(`Successfully generated ${OUTPUT_PATH} with ${allCutoffs.length} entries.`);
