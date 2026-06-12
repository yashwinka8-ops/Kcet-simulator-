import fs from 'fs';

const text = fs.readFileSync('first round.txt', 'utf8');
const lines = text.split(/\r?\n/).map(l => l.trimEnd());

let inE005 = false;
for (let i = 0; i < lines.length; i++) {
  if (/^College:\s*\(?E005/.test(lines[i])) {
    inE005 = true;
  } else if (/^College:\s*\(?E006/.test(lines[i])) {
    break;
  }
  
  if (inE005) {
    if (lines[i].match(/^[A-Z\s\(\)&/-]+$/) && lines[i].length > 4 && !['Generated on:', 'Seat Type:'].includes(lines[i])) {
      console.log(lines[i]);
    }
  }
}
