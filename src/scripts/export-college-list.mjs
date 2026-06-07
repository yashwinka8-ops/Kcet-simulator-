import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../lib/data/colleges_unified.json');
const rawData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const collegeNames = rawData.colleges.map(c => `${c.college_id} - ${c.name}`).sort();

fs.writeFileSync(path.join(__dirname, '../../college_list.txt'), collegeNames.join('\n'));
console.log(`Saved ${collegeNames.length} college names to college_list.txt`);
