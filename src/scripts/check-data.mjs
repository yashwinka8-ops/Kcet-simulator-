import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../lib/data/colleges_unified.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const colleges = rawData.colleges;

const regionCounts = {};
const missingRegion = [];

colleges.forEach(c => {
    const r = c.region;
    if (!r) missingRegion.push(c.college_id);
    regionCounts[r] = (regionCounts[r] || 0) + 1;
});

console.log("Region Counts:", regionCounts);
console.log("Colleges missing region:", missingRegion.length);
if (missingRegion.length > 0) console.log("Example missing:", missingRegion.slice(0, 5));
