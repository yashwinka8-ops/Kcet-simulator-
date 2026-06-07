import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/lib/cutoff-data.json', 'utf8'));
const rvce = data.filter(d => d.college_id === 'E005' && d.category === '3AR');
const r1 = rvce.filter(d => d.round === 1);
console.log('Round 1 branches:', r1.map(d => `${d.branch_name}: ${d.closing_rank}`));
