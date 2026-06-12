import pdf from 'pdf-parse';
import fs from 'fs';
import path from 'path';

const CATEGORIES_R1 = ['1G','1K','1R','2AG','2AK','2AR','2BG','2BK','2BR','3AG','3AK','3AR','3BG','3BK','3BR','GM','GMK','GMR','SCG','SCK','SCR','STG','STK','STR'];
const CATEGORIES_R2 = ['1G','1K','1R','2AG','2AK','2AR','2BG','2BK','2BR','3AG','3AK','3AR','3BG','3BK','3BR','GM','GMK','GMP','GMR','NRI','OPN','OTH','SCG','SCK','SCR','STG','STK','STR'];

const FILES = [
  { name: 'mock', file: 'kcet-cutoff-mock round.pdf', cats: CATEGORIES_R1 },
  { name: 'r1', file: 'first round.pdf', cats: CATEGORIES_R1 },
  { name: 'r2', file: 'kcet-round-2-provisional-cutoff.pdf', cats: CATEGORIES_R2 },
  { name: 'r3', file: 'round 3.pdf', cats: CATEGORIES_R2 },
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

function isNoiseLine(line) {
  const s = line.trim();
  return !s || /^(Generated on:|Page \d+ of)/i.test(s);
}

function isRankValue(line) {
  const s = line.trim();
  return s === '--' || /^-?\d+(\.\d*)?$/.test(s);
}

async function main() {
  const rootDir = 'Y:\\KCET COLLEGE PREDICTOR\\kcet-simulator';
  const outPath = path.join(rootDir, 'src', 'lib', 'data', 'all_data.json');
  
  // Load existing metadata to preserve fees, type, etc.
  let metadataMap = new Map();
  if (fs.existsSync(outPath)) {
      const existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      if (existing.colleges) {
          for (const c of existing.colleges) {
              metadataMap.set(c.college_id, c);
          }
      }
      console.log(`Loaded ${metadataMap.size} existing colleges for metadata.`);
  }

  const collegesMap = new Map(); // K: collegeId, V: { ...collegeData, cutoffs: { branchId: { round: { cat: rank } } } }

  for (const { name: roundName, file, cats } of FILES) {
    console.log(`\n=== Processing ${file} (${roundName}) ===`);
    const pdfPath = path.join(rootDir, file);
    if (!fs.existsSync(pdfPath)) {
        console.error(`PDF missing: ${pdfPath}`);
        continue;
    }
    
    const data = await pdf(fs.readFileSync(pdfPath));
    const lines = data.text.split(/\r?\n/).map(l => l.trimEnd());
    const numCats = cats.length;
    const catSet = new Set(cats);

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      const collMatch = line.match(/^College:\s*\(?(E\d+)\)?\s*(.*?)(?:Course Name|$)/i);

      if (!collMatch) {
          i++;
          continue;
      }

      const collegeId = collMatch[1].toUpperCase();
      let collegeName = collMatch[2].trim();
      
      // Ensure college object exists
      if (!collegesMap.has(collegeId)) {
          const oldMeta = metadataMap.get(collegeId) || {};
          collegesMap.set(collegeId, {
              college_id: collegeId,
              id: oldMeta.id || collegeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              name: oldMeta.name || collegeName,
              full_name: oldMeta.full_name || collegeName,
              city: oldMeta.city || "Karnataka",
              region: oldMeta.region || "Unknown",
              tier: oldMeta.tier || "Unranked",
              college_type: oldMeta.college_type || "Private",
              fees: oldMeta.fees || "N/A",
              avg_package: oldMeta.avg_package || "N/A",
              highest_package: oldMeta.highest_package || "N/A",
              cutoffs: {} // branch -> round -> category -> rank
          });
      }
      
      const colData = collegesMap.get(collegeId);

      i++; // Move past the college line itself
      while (i < lines.length && catSet.has(lines[i].trim())) i++; // Skip category headers

      while (i < lines.length) {
        if (/^College:\s*\(?(E\d+)\)?/i.test(lines[i])) {
            break; // Break inner loop WITHOUT incrementing i, so the next iteration of outer loop catches it
        }

        const cl = lines[i];
        if (isNoiseLine(cl)) { i++; continue; }
        if (catSet.has(cl.trim())) { i++; continue; }
        if (isRankValue(cl)) { i++; continue; }

        const branchCode = getBranchCode(cl);
        if (!branchCode) { 
          i++; 
          continue; 
        }

        i++; // Move past branch name

        const vals = [];
        while (i < lines.length && !/^College:\s*\(?(E\d+)\)?/i.test(lines[i]) && vals.length < numCats) {
          const vl = lines[i].trim();
          if (isNoiseLine(vl)) { i++; continue; }
          if (catSet.has(vl)) { i++; continue; }
          if (!isRankValue(vl)) break;
          vals.push(vl);
          i++; // Move past rank value
        }

        if (vals.length === numCats) {
          if (!colData.cutoffs[branchCode]) {
              colData.cutoffs[branchCode] = {};
          }
          if (!colData.cutoffs[branchCode][roundName]) {
              colData.cutoffs[branchCode][roundName] = {};
          }
          
          for (let c = 0; c < numCats; c++) {
            if (vals[c] !== '--') {
              const r = parseFloat(vals[c]);
              if (!isNaN(r)) {
                  // Keep highest rank (easiest cutoff) if duplicates exist in same branch/round
                  const existing = colData.cutoffs[branchCode][roundName][cats[c]];
                  if (!existing || r > existing) {
                      colData.cutoffs[branchCode][roundName][cats[c]] = r;
                  }
              }
            }
          }
        }
      }
    }
  }

  // Flatten the mapped data back into the `kcet_cutoffs` array
  const finalColleges = [];
  const allBranchesSet = new Set();
  
  for (const [colId, colObj] of collegesMap.entries()) {
      const cutoffsArr = [];
      for (const [branchId, roundsObj] of Object.entries(colObj.cutoffs)) {
          allBranchesSet.add(branchId);
          
          // Determine all categories used across all rounds for this branch
          const categoriesUsed = new Set();
          for (const rnd of Object.values(roundsObj)) {
              for (const cat of Object.keys(rnd)) {
                  categoriesUsed.add(cat);
              }
          }
          
          for (const cat of categoriesUsed) {
              const cutEntry = { branch_id: branchId, category: cat };
              // We only add the rounds if they exist, to save space (no nulls!)
              for (const rnd of ['mock', 'r1', 'r2', 'r3']) {
                  if (roundsObj[rnd] && roundsObj[rnd][cat]) {
                      cutEntry[rnd] = roundsObj[rnd][cat];
                  }
              }
              cutoffsArr.push(cutEntry);
          }
      }
      
      const { cutoffs, ...rest } = colObj;
      finalColleges.push({
          ...rest,
          kcet_cutoffs: cutoffsArr
      });
  }

  // Create branches array
  const branchesOutput = Array.from(allBranchesSet).map(code => {
      const match = Object.entries(RAW_BRANCH_MAP).find(([k, v]) => v === code);
      return {
          branch_id: code,
          branch_code: code,
          branch_name: match ? match[0] : code
      };
  });

  const finalOutput = {
      colleges: finalColleges.sort((a,b) => a.college_id.localeCompare(b.college_id)),
      branches: branchesOutput
  };

  fs.writeFileSync(outPath, JSON.stringify(finalOutput, null, 2));
  console.log(`\nSuccessfully saved ${finalColleges.length} colleges and ${branchesOutput.length} branches to all_data.json`);
  
  const e008 = finalColleges.find(c => c.college_id === 'E008');
  if (e008) {
      console.log(`\nE008 Found! It has ${e008.kcet_cutoffs.length} cutoff entries.`);
  } else {
      console.log(`\nE008 NOT FOUND :(`);
  }
}

main().catch(console.error);
