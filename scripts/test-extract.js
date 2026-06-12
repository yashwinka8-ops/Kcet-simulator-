import fs from 'fs';
import path from 'path';

const CATEGORIES_R1 = ['1G','1K','1R','2AG','2AK','2AR','2BG','2BK','2BR','3AG','3AK','3AR','3BG','3BK','3BR','GM','GMK','GMR','SCG','SCK','SCR','STG','STK','STR'];

const BRANCH_MAP = new Map([
  ['AEROSPACE ENGINEERING', 'AE'],
  ['AERO SPACE ENGINEERING', 'AE'],
  ['BIO-TECHNOLOGY', 'BT'],
  ['BIO TECHNOLOGY', 'BT'],
  ['B TECH IN BIO-TECHNOLOGY', 'BT'],
  ['CHEMICAL ENGINEERING', 'CH'],
  ['CIVIL ENGINEERING', 'CE'],
  ['CIVILENVIRONMENTAL ENGINEERING', 'EV'],
  ['CIVIL ENVIRONMENTAL ENGINEERING', 'EV'],
  ['COMPUTER SCIENCE AND ENGINEERING', 'CS'],
  ['B TECH IN COMPUTER SCIENCE AND ENGINEERING', 'CS'],
  ['COMPUTER SCIENCE AND ENGG(ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', 'AI'],
  ['COMPUTER SCIENCE AND ENGINEERING (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', 'AI'],
  ['COMPUTER SCIENCE AND ENGINEERING(CYBER SECURITY)', 'CY'],
  ['COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)', 'CY'],
  ['COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)', 'DS'],
  ['COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)', 'DS'],
  ['COMPUTER SCIENCE (ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)', 'AI'],
  ['COMPUTER SCIENCE (CYBER SECURITY)', 'CY'],
  ['COMPUTER SCIENCE (DATA SCIENCE)', 'DS'],
  ['ELECTRICAL & ELECTRONICS ENGINEERING', 'EE'],
  ['ELECTRICAL &ELECTRONICS ENGINEERING', 'EE'],
  ['ELECTRICAL AND ELECTRONICS ENGINEERING', 'EE'],
  ['ELECTRONICS AND COMMUNICATION ENGINEERING', 'EC'],
  ['ELECTRONICS AND COMMUNICATION ENGG', 'EC'],
  ['ELECTRONICS ANDCOMMUNICATION ENGG', 'EC'],
  ['ELECTRONICS AND TELECOMMUNICATION ENGINEERING', 'ET'],
  ['ELECTRONICS ANDTELECOMMUNICATION ENGINEERING', 'ET'],
  ['ELECTRONICS AND INSTRUMENTATION ENGINEERING', 'EI'],
  ['ELECTRONICS ANDINSTRUMENTATION ENGINEERING', 'EI'],
  ['INFORMATION SCIENCE AND ENGINEERING', 'IS'],
  ['INFORMATIONSCIENCE AND ENGINEERING', 'IS'],
  ['INFORMATION SCIENCE ANDENGINEERING', 'IS'],
  ['MECHANICAL ENGINEERING', 'ME'],
  ['ARTIFICIAL INTELLIGENCE AND DATA SCIENCE', 'AD'],
  ['ARTIFICIAL INTELLIGENCE ANDDATA SCIENCE', 'AD'],
  ['ARTIFICIALINTELLIGENCE AND DATA SCIENCE', 'AD'],
  ['ARTIFICIALINTELLIGENCE ANDDATA SCIENCE', 'AD'],
  ['ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING', 'AI'],
  ['ARTIFICIALINTELLIGENCE AND MACHINE LEARNING', 'AI'],
  ['ARTIFICIALINTELLIGENCE ANDMACHINE LEARNING', 'AI'],
  ['ARTIFICIAL INTELLIGENCE ENGG', 'AI'],
  ['INDUSTRIAL ENGINEERING AND MANAGEMENT', 'IM'],
  ['INDUSTRIAL ENGINEERING & MANAGEMENT', 'IM'],
  ['INDUSTRIALENGINEERING & MANAGEMENT', 'IM'],
  ['INDUSTRIALENGINEERING ANDMANAGEMENT', 'IM'],
  ['INDUSTRIAL & PRODUCTION ENGINEERING', 'IP'],
  ['CONSTRUCTION TECHNOLOGY AND MANAGEMENT', 'CM'],
  ['CONSTRUCTION TECHNOLOGY AND MGMT', 'CM'],
  ['CONSTRUCTIONTECHNOLOGY AND MGMT', 'CM'],
  ['SILK TECHNOLOGY', 'ST'],
  ['SILKTECHNOLOGY', 'ST'],
  ['TEXTILE TECHNOLOGY', 'TT'],
  ['TEXTILES TECHNOLOGY', 'TT'],
  ['TEXTILESTECHNOLOGY', 'TT'],
  ['MINING ENGINEERING', 'MN'],
  ['MININGENGG', 'MN'],
  ['MARINE ENGINEERING', 'MR'],
  ['MARINEENGG', 'MR'],
  ['MECHATRONICS', 'MT'],
  ['AUTOMOBILE ENGINEERING', 'AU'],
  ['AUTOMOTIVE ENGINEERING', 'AU'],
  ['AERONAUTICAL ENGINEERING', 'AN'],
  ['AERONAUTICALENGG', 'AN'],
  ['AGRICULTURE ENGINEERING', 'AG'],
  ['AGRICULTUREENGG', 'AG'],
  ['PRODUCTION ENGINEERING', 'PR'],
  ['BIO-MEDICAL ENGINEERING', 'BM'],
  ['BIOMEDICAL ENGINEERING', 'BM'],
  ['ROBOTICS AND ARTIFICIAL INTELLIGENCE', 'RI'],
  ['ROBOTICS ANDARTIFICIAL INTELLIGENCE', 'RI'],
  ['CYBER SECURITY', 'CY'],
  ['DATA SCIENCES', 'DS'],
  ['ELECTRONICS ENGINEERING (VLSI DESIGN & TECHNOLOGY)', 'EC'],
  ['AUTOMATION AND ROBOTICS', 'AR'],
  ['AUTOMATIONAND ROBOTICS', 'AR'],
  ['BIOMEDICAL AND ROBOTIC ENGINEERING', 'BR'],
  ['BIOMEDICALAND ROBOTIC ENGINEERING', 'BR'],
  ['BACHELOR OF DESIGN (INTERIOR DESIGN)', 'ID'],
  ['BACHELOR OFDESIGN(INTERIORDESIGN)', 'ID'],
  ['FASHION DESIGN', 'FD'],
  ['COMMUNICATION DESIGN', 'CD'],
  ['ENGINEERING DESIGN', 'ED'],
  ['LIFE STYLE AND ACCESSORY DESIGN', 'LD'],
  ['LIFE STYLE ANDACCESSORYDESIGN', 'LD'],
  ['B.TECH IN COMPUTER SCIENCE (INTERNET OF THINGS)', 'IT'],
  ['B.TECH IN MECHANICAL AND AEROSPACE ENGINEERING', 'ME'],
  ['B.TECH IN ELECTRICAL AND ELECTRONICS ENGINEERING (ELECTRICAL VEHICLE TECHNOLOGY)', 'EV'],
  ['B.PLAN', 'BP'],
  ['DESIGN', 'DG'],
  ['ENGINEERINGDESIGN', 'ED'],
  ['CONSTRUCTIONTECHNOLOGYAND MGMT', 'CM'],
]);

function getBranchCode(raw) {
  let s = raw.toUpperCase().replace(/\s+/g, ' ').trim();
  let direct = BRANCH_MAP.get(s);
  if (direct) return direct;

  s = s.replace(/\(/g, ' (').replace(/\)/g, ') ').replace(/\s+/g, ' ').trim();
  direct = BRANCH_MAP.get(s);
  if (direct) return direct;

  s = s.replace(/[()]/g, '').replace(/\s+/g, ' ').trim();
  direct = BRANCH_MAP.get(s);
  if (direct) return direct;

  for (const [key, val] of BRANCH_MAP) {
    const kn = key.replace(/\s+/g, '');
    const sn = s.replace(/\s+/g, '');
    if (sn === kn || sn.startsWith(kn.substring(0, 20)) || kn.startsWith(sn.substring(0, 15))) return val;
  }
  return null;
}

const text = fs.readFileSync('first round.txt', 'utf8');
const lines = text.split(/\r?\n/).map(l => l.trimEnd());

function isCollegeLine(line) { return /^College:\s*\(?E\d+/i.test(line); }
function isNoiseLine(line) { const s = line.trim(); return !s || /^(Generated on:|Page \d+ of)/i.test(s); }
function isRankValue(line) { const s = line.trim(); return s === '--' || /^-?\d+(\.\d+)?$/.test(s); }

let unmappedBranches = new Set();
const catSet = new Set(CATEGORIES_R1);

let duplicateColleges = {};

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (isCollegeLine(line)) {
    const collegeCodeMatch = line.match(/E\d+/);
    if (!collegeCodeMatch) continue;
    const collegeCode = collegeCodeMatch[0];
    
    let seenBranches = new Set();
    i++;
    while (i < lines.length && catSet.has(lines[i].trim())) i++;
    while (i < lines.length && !isCollegeLine(lines[i])) {
      const cl = lines[i];
      if (isNoiseLine(cl)) { i++; continue; }
      if (catSet.has(cl.trim())) { i++; continue; }
      if (isRankValue(cl)) { i++; continue; }

      const code = getBranchCode(cl);
      if (code) {
        if (seenBranches.has(code)) {
            if (!duplicateColleges[collegeCode]) duplicateColleges[collegeCode] = [];
            duplicateColleges[collegeCode].push(code);
        }
        seenBranches.add(code);
      }
      
      i++;
      let vals = [];
      while (i < lines.length && !isCollegeLine(lines[i]) && vals.length < CATEGORIES_R1.length) {
        const vl = lines[i].trim();
        if (isNoiseLine(vl) || catSet.has(vl)) { i++; continue; }
        if (!isRankValue(vl)) break;
        vals.push(vl);
        i++;
      }
    }
  }
}

console.log("Colleges with duplicate branches:", duplicateColleges);
