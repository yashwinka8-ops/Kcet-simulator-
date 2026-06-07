import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/lib/cutoff-data.json', 'utf8'));
const mech = data.filter(d => d.college_id === 'E005' && d.branch_name.includes('MECHANICAL'));
console.log('Total Mechanical entries:', mech.length);
console.log('Rounds available:', [...new Set(mech.map(d => d.round))]);
const r3 = mech.filter(d => d.round === 3);
console.log('Round 3 Mechanical entries:', r3.length);
console.log('Categories in R3 Mechanical:', r3.map(d => d.category));
