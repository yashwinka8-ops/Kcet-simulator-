import fs from 'fs';
const data = JSON.parse(fs.readFileSync('src/lib/data/colleges_unified.json', 'utf8'));
const acharya = data.find(c => c.id === 'acharya-institute-technology');
if (acharya) {
    console.log('FOUND ACHARYA:');
    console.log(JSON.stringify(acharya, null, 2).substring(0, 1000));
} else {
    console.log('NOT FOUND');
    console.log('First 5 IDs:', data.slice(0, 5).map(c => c.id));
}
