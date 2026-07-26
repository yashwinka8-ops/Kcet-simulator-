import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

const CATEGORIES_R1 = ['1G','1K','1R','2AG','2AK','2AR','2BG','2BK','2BR','3AG','3AK','3AR','3BG','3BK','3BR','GM','GMK','GMP','GMR','NRI','OPN','OTH','S1G','S1K','S1R','S2G','S2K','S2R','S3G','S3K','S3R','S4G','S4K','S4R','STG','STK','STR'];

const FILES = [
  { name: 'mock', file: '2026 MOCK ROUND.pdf', outJson: 'kcet-cutoff-mock-round.json', cats: CATEGORIES_R1 },
  { name: 'round1', file: '2026 ROUND 1.pdf', outJson: 'first-round.json', cats: CATEGORIES_R1 },
];

const RAW_BRANCH_MAP = {
  'ARCHITECTURE': 'AR',
  'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'AD',
  'AERONAUTICAL ENGINEERING': 'AE',
  'AERO SPACE ENGINEERING': 'AE',
  'B TECH IN AERO SPACE ENGINEERING': 'BL',
  'B TECH IN AERONAUTICAL ENGINEERING': 'ZA',
  'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AI',
  'B TECH IN COMPUTER SCIENCE & ENGINEERING (ARTIFICAL INTELLIGENCE & MACHINE LEARNING)': 'AM',
  'AUTOMOTIVE ENGINEERING': 'AT',
  'AUTOMOBILE ENGINEERING': 'AU',
  'B TECH IN COMPUTER SCIENCE ENGINEERING(AI &ML)': 'AV',
  'B.TECH IN ARTIFICAL INTELLIENCE AND ROBOTICS': 'AW',
  'B TECH IN AGRICULTURAL ENGINEERING': 'BA',
  'B TECH IN ELECTRONICS & COMMUNICATION ENGINEERING': 'BB',
  'B TECH (HONS) COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)': 'BF',
  'B TECH IN ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'BG',
  'B TECH IN ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'BH',
  'INFORMATION TECHNOLOGY & ENGINEERING': 'BI',
  'B TECH IN ELECTRICAL & ELECTRONICS ENGINEERING': 'BJ',
  'B TECH IN ENERGY ENGINEERING': 'BK',
  'BIO-MEDICAL ENGINEERING': 'BM',
  'BIOMEDICAL ENGINEERING': 'BM',
  'B TECH IN COMPUTER SCIENCE AND TECHNOLOGY(BIG DATA)': 'BN',
  'B TECH IN BIO-TECHNOLOGY': 'BO',
  'B TECH IN CIVIL ENGINEERING': 'BP',
  'B TECH IN COMPUTER SCIENCE AND TECHNOLOGY': 'BQ',
  'BIOMEDICAL AND ROBOTIC ENGINEERING': 'BR',
  'BIO-TECHNOLOGY': 'BT',
  'B TECH IN COMPUTER SCIENCE AND INFORMATION TECHNOLOGY': 'BU',
  'B TECH IN COMPUTER ENGINEERING': 'BV',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING': 'BW',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(CYBER SECURITY)': 'BX',
  'B TECH IN COMPUTER SCIENCE AND TECHNOLOGY(DEV OPS)': 'BY',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)': 'BZ',
  'COMPUTER SCIENCE AND ENGG(ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)': 'CA',
  'COMPUTER SCIENCE AND BUSINESS SYSTEMS': 'CB',
  'COMPUTER AND COMMUNICATION ENGINEERING': 'CC',
  'COMPUTER SCIENCE AND DESIGN': 'CD',
  'CIVIL ENGINEERING': 'CE',
  'COMPUTER SCIENCE AND ENGG (ARTIFICIAL INTELLIGENCE)': 'CF',
  'COMPUTER SCIENCE & TECHNOLOGY': 'CG',
  'CHEMICAL ENGINEERING': 'CH',
  'CIVIL ENGINEERING (KANNADA MEDIUM)': 'CK',
  'B TECH IN ELECTRONICS & COMPUTER ENGINEERING': 'CL',
  'BTECH IN ELECTRONICS ENGINEERING(VLSI DESIGN & TECHNOLOGY)': 'CM',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(IOT INCLUDING BLOCK CHAIN)': 'CN',
  'COMPUTER ENGINEERING': 'CO',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(IOT)': 'CQ',
  'CERAMICS & CEMENT ENGINEERING': 'CR',
  'COMPUTER SCIENCE AND ENGINEERING': 'CS',
  'CONSTRUCTION TECHNOLOGY AND MGMT': 'CT',
  'CONSTRUCTION TECHNOLOGY AND MANAGEMENT': 'CT',
  'B TECH IN INFORMATION SCIENCE ENGINEERING': 'CU',
  'CIVIL ENVIRONMENTAL ENGINEERING': 'CV',
  'B TECH IN INFORMATION TECHNOLOGY': 'CW',
  'B TECH IN INFORMATION SCIENCE & TECHNOLOGY': 'CX',
  'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': 'CY',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(BLOCK CHAIN)': 'CZ',
  'B TECH IN MATHAMATICS AND COMPUTING': 'DA',
  'B TECH IN MECHANICAL ENGINEERING': 'DB',
  'DATA SCIENCES': 'DC',
  'B TECH IN MECHATRONICS ENGINEERING': 'DD',
  'B TECH IN PETROLEUM ENGINEERING': 'DE',
  'B TECH IN ROBOTICS AND AUTOMATION': 'DF',
  'DESIGN': 'DG',
  'B TECH IN ROBOTICS AND ARTIFICIAL INTELLIGENCE': 'DH',
  'B TECH IN ROBOTIC ENGINEERING': 'DI',
  'B TECH IN ROBOTICS ENGINEERING': 'DJ',
  'B TECH IN COMPUTER SCIENCE AND SYSTEM ENGG': 'DK',
  'B TECH IN COMPUTER SCIENCE': 'DL',
  'COMPUTER SCIENCE AND ENGINEERING (NETWORKS)': 'DM',
  'B.TECH IN VLSI': 'DN',
  'COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)': 'DS',
  'B TECH IN CIVIL ENGINEERING AND TOWN PLANNING': 'DU',
  'B TECH (HONS) COMPUTER SCIENCE AND ENGINEERING': 'DV',
  'B.TECH (HONS) COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': 'DW',
  'CIVIL AND INFRASTRUCTURE ENGINEERING': 'DX',
  'B.TECH (HONS) ELECTRONICS AND COMMUNICATION': 'DY',
  'AGRICULTURE ENGINEERING': 'EA',
  'ELECTRONICS AND COMMUNICATION (ADVANCED COMMUNICATION TECHNOLOGY)': 'EB',
  'ELECTRONICS AND COMMUNICATION ENGG': 'EC',
  'ELECTRICAL & ELECTRONICS ENGINEERING': 'EE',
  'ELECTRONICS AND INSTRUMENTATION ENGINEERING': 'EI',
  'ELECTRONICS & INSTRUMENTATION ENGINEERING': 'EL',
  'ENVIRONMENTAL ENGINEERING': 'EN',
  'ENVIRONMENTALENGINEERING': 'EN',
  'ELECTRICAL & COMPUTER ENGINEERING': 'ER',
  'ELECTRONICS & COMPUTER ENGINEERING': 'ES',
  'ELECTRONICS AND TELECOMMUNICATION ENGINEERING': 'ET',
  'ELECTRONICS ENGINEERING(VLSI DESIGN & TECHNOLOGY)': 'EV',
  'ELECTRONICS & COMPUTER SCIENCE': 'EZ',
  'B.TECH IN COMPUTER SCIENCE & ENGINEERING(ARTIFICIAL INTELLIGENCE)': 'IA',
  'COMPUTER SCIENCE AND ENGG(INTERNET OF THINGS & CYBER SECURITY INCLUDING BLOCK CHAIN TECH)': 'IC',
  'INFORMATION SCIENCE AND ENGINEERING': 'IE',
  'ELECTRONICS & COMMUNICATION ENGINEERING(INDUSTRIAL INTEGTATED)': 'II',
  'INDUSTRIAL ENGINEERING & MANAGEMENT': 'IM',
  'INDUSTRIAL ENGINEERING AND MANAGEMENT': 'IM',
  'COMPUTER SCIENCE AND ENGG(INTERNET OF THINGS)': 'IO',
  'INDUSTRIAL & PRODUCTION ENGINEERING': 'IP',
  'INFORMATION SCIENCE': 'IZ',
  'B.PLAN': 'LA',
  'B TECH IN COMPUTER SCIENCE (DATA SCIENCE)': 'LD',
  'B TECH IN COMPUTER SCIENCE(AI &ML)': 'LE',
  'B TECH IN COMPUTER SCIENCE (CLOUD COMPUTING)': 'LF',
  'B TECH IN COMPUTER SCIENCE (CYBER SECURITY)': 'LG',
  'B TECH IN COMPUTER SCIENCE (INFORMATION SECURITY)': 'LH',
  'B.TECH IN COMPUTER SCIENCE & ENGG (BUSINESS SYSTEMS)': 'LJ',
  'B.TECH IN COMPUTER SCIENCE (INTERNET OF THINGS)': 'LK',
  'ARTIFICIAL INTELLIGENCE': 'LM',
  'QUANTUM COMPUTING': 'LN',
  'QUANTUMCOMPUTING': 'LN',
  'MEDICAL ELECTRONICS ENGINEERING': 'MD',
  'MECHANICAL ENGINEERING': 'ME',
  'MINING ENGINEERING': 'MI',
  'MECHANICAL ENGINEERING (KANNADA MEDIUM)': 'MK',
  'MECHANICAL AND SMART MANUFACTURING': 'MM',
  'MARINE ENGINEERING': 'MR',
  'MECHATRONICS': 'MT',
  'INDUSTRIAL IOT': 'OT',
  'POLYMER SCIENCE & TECHNOLOGY': 'PT',
  'POLYMERSCIENCE &TECHNOLOGY': 'PT',
  'ROBOTICS AND AUTOMATION': 'RA',
  'ROBOTICS AND ARTIFICIAL INTELLIGENCE': 'RI',
  'AUTOMATION AND ROBOTICS': 'RO',
  'AUTOMATION AND ROBOTICENGINEERING': 'RO',
  'AERO SPACE ENGINEERING': 'SE',
  'SILK TECHNOLOGY': 'ST',
  'TELECOMMUNICATION ENGINEERING': 'TC',
  'TEXTILES TECHNOLOGY': 'TX',
  'PLANNING': 'UP',
  'B.TECH IN COMPUTER SCIENCE AND ENGG (ROBOTICS)': 'YA',
  'B.TECH IN COMPUTER SICENCE AND ENGG (DATA ANALYTICS)': 'YB',
  'B.TECH IN EMBEDDED SYSTEM AND VLSI': 'YC',
  'B.TECH IN COMPUTER SCIENCE AND ARTIFICIAL INTELLIGENCE': 'YD',
  'B.TECH IN CIVIL CONSTRUCTION AND SUSTAINABILITY ENGINEERING': 'YE',
  'B.TECH IN ELECTRICAL ENGINEERING AND COMPUTER SCIENCE': 'YF',
  'B.TECH IN ELECTRONICS ENGINEERING (VLSI AND EMBEDDED SYSTEM)': 'YG',
  'ENGINEERING DESIGN': 'YH',
  'B.TECH IN MECHANICAL AND AEROSPACE ENGINEERING': 'YI',
  'B.TECH IN BIOTECHNOLOGY & BIO-ENGINEERING': 'YJ',
  'B TECH IN COMPUTER SCIENCE & ENGG (ARTIFICIAL INTELLIGENCE AND FUTURE TECHNOLOGIES)': 'YK',
  'B.TECH IN COMPUTER SCIENCE AND MEDICAL ENGINEERING': 'YL',
  'COMMUNICATION DESIGN': 'YM',
  'COMPUTER SCIENCE AND TECHNOLOGY(EXCLUSIVELY FOR DIFFERENTLY ABLED)': 'YN',
  'B.TECH IN ELECTRONICS ENGINEERING': 'YO',
  'B.TECH IN ELECTRICAL & ELECTRONICS ENGINEERING (ELECTRICAL VEHICLE TECHNOLOGY)': 'YP',
  'FASHION DESIGN': 'YQ',
  'INDUSTRIAL DESIGN': 'YR',
  'INDUSTRIALDESIGN': 'YR',
  'LIFE STYLE AND ACCESSORY DESIGN': 'YS',
  'PRODUCTION ENGINEERING': 'YT',
  'B.TECH IN COMPUTER ENGINEERING(SOFTWARE PRODUCT DEVELOPMENT)': 'YU',
  'ELECTRONICS AND COMMUNICATION ENGG (VLSI DESIGN AND TECHNOLOGY)': 'YV',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING (CLOUD COMPUTING)': 'YW',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(DEV OPS)': 'YX',
  'B.TECH IN COMPUTER SCIENCE AND ENGINEERING(FULL STACK DEVELOPMENT)': 'YY',
  'B TECH IN AERONAUTICAL ENGINEERING': 'ZA',
  'B TECH (HONS) COMPUTER SCIENCE AND ENGINEERING(ARTIFICAL INTELLIGENCE AND MACHINE LEARNING)': 'ZB',
  'COMPUTER SCIENCE': 'ZC',
  'B TECH IN COMPUTER SCIENCE AND ENGINEERING(ARTIFICIAL INTELLIGENCE AND DATA SCIENCE)': 'ZH',
  'CIVIL ENGINEERING WITH COMPUTER APPLICATION': 'ZL',
  'BTECH IN COMPUTER SCIENCE AND DESIGN': 'ZM',
  'BTECH IN PHARMACEUTICAL ENGINEERING': 'ZN',
  'BTECH IN COMPUTER SCIENCE AND BUSINESS SYSTEMS': 'ZO',
  'BTECH IN INFORMATION TECHNOLOGY DATA ANALYTICS': 'ZQ',
  'COMPUTER SCIENCE AND ENGINEERING(ARTIFICAL INTELLIGENCE & DATA SCIENCE)': 'ZR',
  'BACHELOR OF DESIGN(INTERIOR DESIGN)': 'ZS',
  'BTECH IN MECHANICAL AND SMART MANUFACTURING': 'ZT',
  'CYBER SECURITY': 'ZU',
  'BTECH IN INFORMATION TECHNOLOGY AUGMENTED REALITY AND VIRUTAL REALITY(AR/VR)': 'ZV',
  'COMPUTER SCIENCE AND ENGINEERING (AIML)': 'ZW'
};

const SANITIZED_MAP = new Map();
for (const [k, v] of Object.entries(RAW_BRANCH_MAP)) {
  const sanitized = k.toUpperCase().replace(/[^A-Z]/g, '');
  SANITIZED_MAP.set(sanitized, v);
}

function getBranchCode(raw) {
  const sanitized = raw.toUpperCase().replace(/[^A-Z]/g, '');
  if (SANITIZED_MAP.has(sanitized)) return SANITIZED_MAP.get(sanitized);
  
  if (sanitized.includes('COMPUTERSCIENCE') && (sanitized.includes('ARTIFICIALINTELLIGENCE') || sanitized.includes('ARTIFICALINTELLIGENCE'))) return 'AI';
  if (sanitized.includes('COMPUTERSCIENCE') && sanitized.includes('CYBER')) return 'CY';
  if (sanitized.includes('COMPUTERSCIENCE') && sanitized.includes('DATA')) return 'DS';
  if (sanitized.includes('COMPUTERSCIENCE')) return 'CS';
  if (sanitized.includes('INFORMATIONSCIENCE')) return 'IS';
  if (sanitized.includes('ELECTRONICS') && sanitized.includes('COMMUNICATION')) return 'EC';
  if (sanitized.includes('MECHANICAL')) return 'ME';
  if (sanitized.includes('CIVIL')) return 'CE';
  if (sanitized.includes('ELECTRICAL') && sanitized.includes('ELECTRONICS')) return 'EE';
  if (sanitized.includes('ARTIFICIALINTELLIGENCE') || sanitized.includes('ARTIFICALINTELLIGENCE')) {
    if (sanitized.includes('DATA')) return 'AD';
    if (sanitized.includes('MACHINE')) return 'AI';
  }
  
  return null;
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
  const outDir = path.join(pdfDir, 'src', 'lib', 'data', 'raw_cutoffs');

  let totalUnmapped = new Set();

  for (const { name, file, outJson, cats } of FILES) {
    console.log(`\n=== Processing ${file} ===`);
    const pdfPath = path.join(pdfDir, file);
    if (!fs.existsSync(pdfPath)) {
        console.error(`PDF missing: ${pdfPath}`);
        continue;
    }
    const dataObj = await pdf(fs.readFileSync(pdfPath));
    const rawLines = dataObj.text.split(/\r?\n/).map(l => l.trimEnd()).filter(l => l.trim() !== '');
    
    const lines = [];
    let idx = 0;
    while (idx < rawLines.length) {
      const line = rawLines[idx].trim();
      if (line.startsWith("Generated on:") && idx + 1 < rawLines.length && rawLines[idx+1].trim().startsWith("Page ")) {
        let skipCount = 2;
        if (idx + 2 < rawLines.length && /^\d+$/.test(rawLines[idx+2].trim())) {
          skipCount = 3;
        }
        idx += skipCount;
      } else {
        lines.push(rawLines[idx]);
        idx++;
      }
    }
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
        colleges[collegeCode] = { cutoffs: {} };
      }
      const data = colleges[collegeCode].cutoffs;

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

        const rawVals = [];
        while (i < lines.length && !isCollegeLine(lines[i])) {
          const vl = lines[i].trim();
          if (isNoiseLine(vl)) { i++; continue; }
          if (catSet.has(vl)) { i++; continue; }
          if (!isRankValue(vl)) break;
          rawVals.push(vl);
          i++;
        }

        let vals = [];
        let j = 0;
        let mergesNeeded = rawVals.length - numCats;
        while (j < rawVals.length) {
          const v = rawVals[j];
          if (j + 1 < rawVals.length &&
              v !== '--' &&
              v.includes('.') &&
              /^\d+$/.test(rawVals[j+1]) &&
              mergesNeeded > 0) {
            vals.push(v + rawVals[j+1]);
            j += 2;
            mergesNeeded--;
          } else {
            vals.push(v);
            j++;
          }
        }

        if (vals.length > numCats) {
          vals = vals.slice(0, numCats);
        } else if (vals.length < numCats) {
          while (vals.length < numCats) vals.push('--');
        }

        if (vals.length === numCats) {
          const obj = {};
          for (let c = 0; c < numCats; c++) {
            if (vals[c] !== '--') {
              const r = parseFloat(vals[c]);
              if (!isNaN(r)) obj[cats[c]] = Math.floor(r);
              else obj[cats[c]] = null;
            } else {
              obj[cats[c]] = null;
            }
          }
          if (Object.keys(obj).length > 0) {
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
      
      if (i < lines.length && isCollegeLine(lines[i])) {
        i--;
      }
    }

    const outPath = path.join(outDir, outJson);
    fs.writeFileSync(outPath, JSON.stringify(colleges, null, 2));
    console.log(`Wrote: ${Object.keys(colleges).length} colleges to ${outJson}`);
  }
  
  if (totalUnmapped.size > 0) {
      console.log("\nWARNING: Unmapped branches found:");
      console.log(Array.from(totalUnmapped).join(" | "));
  } else {
      console.log("\nAll branches successfully mapped!");
  }
}

main().catch(e => { console.error(e); process.exit(1); });
