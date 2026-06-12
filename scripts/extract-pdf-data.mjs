import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

const CATEGORIES_R1 = ['1G','1K','1R','2AG','2AK','2AR','2BG','2BK','2BR','3AG','3AK','3AR','3BG','3BK','3BR','GM','GMK','GMR','SCG','SCK','SCR','STG','STK','STR'];
const CATEGORIES_R2 = ['1G','1K','1R','2AG','2AK','2AR','2BG','2BK','2BR','3AG','3AK','3AR','3BG','3BK','3BR','GM','GMK','GMP','GMR','NRI','OPN','OTH','SCG','SCK','SCR','STG','STK','STR'];

const FILES = [
  { name: 'round1', file: 'first round.pdf', textFile: 'first round.txt', cats: CATEGORIES_R1 },
  { name: 'mock', file: 'kcet-cutoff-mock round.pdf', textFile: 'kcet-cutoff-mock round.txt', cats: CATEGORIES_R1 },
  { name: 'round2', file: 'kcet-round-2-provisional-cutoff.pdf', textFile: 'kcet-round-2-provisional-cutoff.txt', cats: CATEGORIES_R2 },
  { name: 'round3', file: 'round 3.pdf', textFile: 'round 3.txt', cats: CATEGORIES_R2 },
];

const RAW_BRANCH_MAP = {
  'AEROSPACE ENGINEERING': 'AE',
  'AERO SPACE ENGINEERING': 'AE',
  'B TECH IN AEROSPACE ENGINEERING': 'AE',
  'BIO TECHNOLOGY': 'BT',
  'B TECH IN BIO TECHNOLOGY': 'BT',
  'CHEMICAL ENGINEERING': 'CH',
  'CIVIL ENGINEERING': 'CE',
  'B TECH IN CIVIL ENGINEERING': 'CE',
  'CIVIL ENVIRONMENTAL ENGINEERING': 'EV',
  'COMPUTER SCIENCE AND ENGINEERING': 'CS',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING': 'CS',
  'COMPUTER ENGINEERING': 'CO',
  'COMPUTER AND COMMUNICATION ENGINEERING': 'CO',
  'COMPUTER SCIENCE AND ENGG ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
  'COMPUTER SCIENCE AND ENGINEERING ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
  'COMPUTER SCIENCE ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
  'B TECH IN ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
  'COMPUTER SCIENCE AND ENGINEERING CYBER SECURITY': 'CY',
  'COMPUTER SCIENCE CYBER SECURITY': 'CY',
  'COMPUTER SCIENCE AND ENGINEERING DATA SCIENCE': 'DS',
  'COMPUTER SCIENCE DATA SCIENCE': 'DS',
  'ELECTRICAL ELECTRONICS ENGINEERING': 'EE',
  'B TECH IN ELECTRICAL ELECTRONICS ENGINEERING': 'EE',
  'ELECTRONICS AND COMMUNICATION ENGINEERING': 'EC',
  'ELECTRONICS COMMUNICATION ENGINEERING': 'EC',
  'B TECH IN ELECTRONICS COMMUNICATION ENGINEERING': 'EC',
  'ELECTRONICS AND COMMUNICATION ENGG': 'EC',
  'B TECH IN ELECTRONICS ENGINEERING': 'EX',
  'ELECTRONICS COMMUNICATION ENGINEERING INDUSTRIAL INTEGTATED': 'EC',
  'ELECTRONICS AND TELECOMMUNICATION ENGINEERING': 'ET',
  'ELECTRONICS AND INSTRUMENTATION ENGINEERING': 'EI',
  'INFORMATION SCIENCE AND ENGINEERING': 'IS',
  'B TECH IN INFORMATION SCIENCE ENGINEERING': 'IS',
  'B TECH IN INFORMATION SCIENCE TECHNOLOGY': 'IS',
  'MECHANICAL ENGINEERING': 'ME',
  'B TECH IN MECHANICAL ENGINEERING': 'ME',
  'B TECH IN MECHANICAL AND SMART MANUFACTURING': 'MS',
  'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'AD',
  'B TECH IN ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'AD',
  'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
  'ARTIFICIAL INTELLIGENCE ENGG': 'AI',
  'INDUSTRIAL ENGINEERING AND MANAGEMENT': 'IM',
  'INDUSTRIAL PRODUCTION ENGINEERING': 'IP',
  'CONSTRUCTION TECHNOLOGY AND MANAGEMENT': 'CM',
  'CONSTRUCTION TECHNOLOGY AND MGMT': 'CM',
  'SILK TECHNOLOGY': 'ST',
  'TEXTILE TECHNOLOGY': 'TT',
  'TEXTILES TECHNOLOGY': 'TT',
  'MINING ENGINEERING': 'MN',
  'MINING ENGG': 'MN',
  'MARINE ENGINEERING': 'MR',
  'MARINE ENGG': 'MR',
  'MECHATRONICS': 'MT',
  'B TECH IN MECHATRONICS ENGINEERING': 'MT',
  'AUTOMOBILE ENGINEERING': 'AU',
  'AUTOMOTIVE ENGINEERING': 'AU',
  'AERONAUTICAL ENGINEERING': 'AN',
  'B TECH IN AERONAUTICAL ENGINEERING': 'AN',
  'AERONAUTICAL ENGG': 'AN',
  'AGRICULTURE ENGINEERING': 'AG',
  'B TECH IN AGRICULTURAL ENGINEERING': 'AG',
  'AGRICULTURE ENGG': 'AG',
  'PRODUCTION ENGINEERING': 'PR',
  'BIO MEDICAL ENGINEERING': 'BM',
  'BIOMEDICAL ENGINEERING': 'BM',
  'MEDICAL ELECTRONICS ENGINEERING': 'ML',
  'ROBOTICS AND ARTIFICIAL INTELLIGENCE': 'RI',
  'B Tech in ROBOTICS AND ARTIFICIAL INTELLIGENCE': 'RI',
  'ROBOTICS AND AUTOMATION': 'RA',
  'B TECH IN ROBOTIC ENGINEERING': 'RO',
  'CYBER SECURITY': 'CY',
  'DATA SCIENCES': 'DS',
  'ELECTRONICS ENGINEERING VLSI DESIGN TECHNOLOGY': 'EC',
  'B Tech in VLSI': 'VL',
  'AUTOMATION AND ROBOTICS': 'AR',
  'BIOMEDICAL AND ROBOTIC ENGINEERING': 'BR',
  'BACHELOR OF DESIGN INTERIOR DESIGN': 'ID',
  'FASHION DESIGN': 'FD',
  'COMMUNICATION DESIGN': 'CD',
  'ENGINEERING DESIGN': 'ED',
  'LIFE STYLE AND ACCESSORY DESIGN': 'LD',
  'B TECH IN COMPUTER SCIENCE INTERNET OF THINGS': 'IT',
  'B TECH IN INFORMATION TECHNOLOGY': 'IT',
  'B TECH IN INFORMATION TECHNOLOGY AUGMENTED REALITY AND VIRUTAL REALITY AR VR': 'IT',
  'B TECH IN INFORMATION TECHNOLOGY DATA ANALYTICS': 'IT',
  'B TECH IN MECHANICAL AND AEROSPACE ENGINEERING': 'MA',
  'B TECH IN ELECTRICAL AND ELECTRONICS ENGINEERING ELECTRICAL VEHICLE TECHNOLOGY': 'EV',
  'B PLAN': 'BP',
  'PLANNING': 'BP',
  'DESIGN': 'DG',
  'ELECTRONICS COMPUTER ENGINEERING': 'EX',
  'ELECTRICAL COMPUTER ENGINEERING': 'EX',
  'B TECH IN ELECTRONICS COMPUTER ENGINEERING': 'EX',
  'ELECTRONICS COMPUTER SCIENCE': 'EX',
  'CERAMICS CEMENT ENGINEERING': 'CC',
  'B TECH IN ENERGY ENGINEERING': 'EN',
  'B TECH IN PETROLEUM ENGINEERING': 'PE',
  'B TECH IN PHARMACEUTICAL ENGINEERING': 'PH',
  'B TECH IN COMPUTER ENGINEERING SOFTWARE PRODUCT DEVELOPMENT': 'CO',
  'B TECH IN MATHAMATICS AND COMPUTING': 'MC',
  'B TECH IN ELECTRONICS ENGINEERING VLSI DESIGN TECHNOLOGY': 'EC',
  'B TECH IN COMPUTER SICENCE AND ENGG DATA ANALYTICS': 'CS',
  'B TECH IN EMBEDDED SYSTEM AND VLSI': 'EC',
  'B Tech In BIOTECHNOLOGY BIO ENGINEERING': 'BT',
  'B TECH IN ELECTRONICS ENGINEERING VLSI AND EMBEDDED SYSTEM': 'EC',
  'INDUSTRIAL ENGINEERING MANAGEMENT': 'IM',
  'INDUSTRIAL ENGINEERING AND MANAGEMENT': 'IM',
  'B TECH IN ROBOTICS ENGINEERING': 'RO',
  'B TECH IN COMPUTER ENGINEERING': 'CO',
  'B TECH IN ROBOTICS AND AUTOMATION': 'RA'
};

const SANITIZED_MAP = new Map();
for (const [k, v] of Object.entries(RAW_BRANCH_MAP)) {
  const sanitized = k.toUpperCase().replace(/[^A-Z]/g, '');
  SANITIZED_MAP.set(sanitized, v);
}

function getBranchCode(raw) {
  const sanitized = raw.toUpperCase().replace(/[^A-Z]/g, '');
  if (SANITIZED_MAP.has(sanitized)) return SANITIZED_MAP.get(sanitized);
  
  if (sanitized.includes('COMPUTERSCIENCE') && sanitized.includes('ARTIFICIALINTELLIGENCE')) return 'AI';
  if (sanitized.includes('COMPUTERSCIENCE') && sanitized.includes('CYBER')) return 'CY';
  if (sanitized.includes('COMPUTERSCIENCE') && sanitized.includes('DATA')) return 'DS';
  if (sanitized.includes('COMPUTERSCIENCE')) return 'CS';
  if (sanitized.includes('INFORMATIONSCIENCE')) return 'IS';
  if (sanitized.includes('ELECTRONICS') && sanitized.includes('COMMUNICATION')) return 'EC';
  if (sanitized.includes('MECHANICAL')) return 'ME';
  if (sanitized.includes('CIVIL')) return 'CE';
  if (sanitized.includes('ELECTRICAL') && sanitized.includes('ELECTRONICS')) return 'EE';
  if (sanitized.includes('ARTIFICIALINTELLIGENCE') && sanitized.includes('DATA')) return 'AD';
  if (sanitized.includes('ARTIFICIALINTELLIGENCE') && sanitized.includes('MACHINE')) return 'AI';
  
  return null;
}

async function readCutoffText(pdfDir, file, textFile) {
  const textPath = path.join(pdfDir, textFile);
  if (fs.existsSync(textPath)) {
    console.log(`Using extracted text: ${textFile}`);
    return fs.readFileSync(textPath, 'utf8');
  }

  console.log(`Extracted text missing; parsing PDF directly: ${file}`);
  const data = await pdf(fs.readFileSync(path.join(pdfDir, file)));
  return data.text;
}

function isCollegeLine(line) {
  return /^College:\s*\(?E\d+/i.test(line);
}

function isNoiseLine(line) {
  const s = line.trim();
  return !s || /^(Generated on:|Page \d+ of)/i.test(s);
}

function isRankValue(line) {
  const s = line.trim();
  return s === '--' || /^-?\d+(\.\d*)?$/.test(s);
}

async function main() {
  const pdfDir = 'Y:\\KCET COLLEGE PREDICTOR\\kcet-simulator';
  const outDir = path.join(pdfDir, 'src', 'lib', 'data');

  let totalUnmapped = new Set();

  for (const { name, file, textFile, cats } of FILES) {
    console.log(`\n=== ${file} (${name}) ===`);
    const text = await readCutoffText(pdfDir, file, textFile);
    const lines = text.split(/\r?\n/).map(l => l.trimEnd());
    const numCats = cats.length;
    const catSet = new Set(cats);

    const colleges = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const isColl = isCollegeLine(line);

      if (!isColl) continue;

      const collegeCode = line.match(/E\d+/)?.[0];
      if (!collegeCode) continue;

      if (!colleges[collegeCode]) {
        colleges[collegeCode] = {};
      }
      const data = colleges[collegeCode];

      i++;
      while (i < lines.length && catSet.has(lines[i].trim())) i++;

      while (i < lines.length && !isCollegeLine(lines[i])) {
        const cl = lines[i];
        if (isNoiseLine(cl)) { i++; continue; }
        if (catSet.has(cl.trim())) { i++; continue; }
        if (isRankValue(cl)) { i++; continue; }

        const code = getBranchCode(cl);
        if (!code) { 
          totalUnmapped.add(cl.trim());
          i++; 
          continue; 
        }

        i++;

        const vals = [];
        while (i < lines.length && !isCollegeLine(lines[i]) && vals.length < numCats) {
          const vl = lines[i].trim();
          if (isNoiseLine(vl)) { i++; continue; }
          if (catSet.has(vl)) { i++; continue; }
          if (!isRankValue(vl)) break;
          vals.push(vl);
          i++;
        }

        if (vals.length === numCats) {
          const obj = {};
          for (let c = 0; c < numCats; c++) {
            if (vals[c] !== '--') {
              const r = parseFloat(vals[c]);
              if (!isNaN(r)) obj[cats[c]] = r;
            }
          }
          if (Object.keys(obj).length > 0) {
            // Keep the easiest cutoff (max rank) if duplicate branch exists
            if (!data[code]) {
                data[code] = obj;
            } else {
                for (const cat of Object.keys(obj)) {
                    if (!data[code][cat] || obj[cat] > data[code][cat]) {
                        data[code][cat] = obj[cat];
                    }
                }
            }
          }
        }
      }
    }

    const outPath = path.join(outDir, `cutoffs_${name}.json`);
    fs.writeFileSync(outPath, JSON.stringify(colleges, null, 2));
    console.log(`Wrote: ${Object.keys(colleges).length} colleges to cutoffs_${name}.json`);

    const first5 = Object.keys(colleges).sort().slice(0, 5);
    console.log(`  First colleges: ${first5.join(', ')}`);
    if (colleges['E005']) console.log(`  E005 branches: ${Object.keys(colleges['E005']).join(', ')}`);
  }
  
  if (totalUnmapped.size > 0) {
      console.log("\nWARNING: Unmapped branches found:");
      console.log(Array.from(totalUnmapped).join(" | "));
  } else {
      console.log("\nAll branches successfully mapped!");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
