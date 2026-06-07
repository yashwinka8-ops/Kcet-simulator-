import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pdfFiles = [
  { path: '../../../first round.pdf', round: 1, year: 2024 },
  { path: '../../../kcet-round-2-provisional-cutoff.pdf', round: 2, year: 2024 },
  { path: '../../../round 3.pdf', round: 3, year: 2024 }
];

const categories = ["1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR", "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GM", "GMK", "GMR", "SCG", "SCK", "SCR", "STG", "STK", "STR"];

async function extractData() {
  const collegesMap = new Map();
  const branchesMap = new Map();
  const collegeBranchesMap = new Map();
  const cutoffData = [];

  for (const file of pdfFiles) {
    const filePath = path.join(__dirname, file.path);
    if (!fs.existsSync(filePath)) continue;

    console.log(`Processing ${file.path}...`);
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const textResult = await parser.getText();
    const text = textResult.text;

    const lines = text.split('\n');
    let currentCollegeId = "";

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('UGCET-') || line.startsWith('Seat Type:') || line.startsWith('KARNATAKA')) continue;

      const collegeMatch = line.match(/^College:\s+([E][0-9]{3})\s+(.+)$/);
      if (collegeMatch) {
        currentCollegeId = collegeMatch[1];
        const collegeName = collegeMatch[2];
        if (!collegesMap.has(currentCollegeId)) {
          collegesMap.set(currentCollegeId, {
            college_id: currentCollegeId,
            short_name: collegeName.split(' ')[0],
            full_name: collegeName,
            city: collegeName.includes('Bangalore') || collegeName.includes('Bengaluru') ? "Bengaluru" : "Other",
            college_type: collegeName.includes('Government') ? "Government" : "Private",
            naac_grade: "A",
            fees: 100000,
            avg_package: 6,
            highest_package: 25
          });
        }
        continue;
      }

      if (!currentCollegeId) continue;
      if (line.includes('Course Name') && line.includes('1G')) continue;

      const isRanksLine = (line.match(/(\d+|--|\.\d+)/g) || []).length > 5;
      if (isRanksLine) {
        // Find the course name before this line
        let j = i - 1;
        let courseLines = [];
        while (j >= 0 && !lines[j].includes('College:') && (lines[j].match(/(\d+|--)/g) || []).length < 3) {
          if (lines[j].trim() && !lines[j].includes('Course Name')) {
             courseLines.unshift(lines[j].trim());
          }
          j--;
        }
        const branchName = courseLines.join(' ').trim();
        if (!branchName) continue;

        const branchCode = branchName.substring(0, 4).toUpperCase().replace(/ /g, '');
        if (!branchesMap.has(branchCode)) {
          branchesMap.set(branchCode, {
            branch_id: branchCode,
            branch_code: branchCode,
            branch_name: branchName
          });
        }

        const cbId = `${currentCollegeId}-${branchCode}`;
        if (!collegeBranchesMap.has(cbId)) {
          collegeBranchesMap.set(cbId, {
            id: cbId,
            college_id: currentCollegeId,
            branch_id: branchCode
          });
        }

        const numericRanks = line.split(/\s+/).filter(r => /^\d+(\.\d+)?$/.test(r) || r === '--');
        numericRanks.forEach((rank, idx) => {
          if (idx < categories.length && rank !== '--') {
            const closingRank = Math.round(parseFloat(rank));
            if (!isNaN(closingRank)) {
              cutoffData.push({
                id: `${cbId}-${categories[idx]}-${file.round}-${file.year}`,
                college_branch_id: cbId,
                category: categories[idx],
                gender: "Male",
                round: file.round,
                year: file.year,
                hk_quota: categories[idx].includes('K'),
                closing_rank: closingRank
              });
            }
          }
        });
      }
    }
  }

  const colleges = Array.from(collegesMap.values());
  const branches = Array.from(branchesMap.values());
  const collegeBranches = Array.from(collegeBranchesMap.values());

  const dataPath = path.join(__dirname, '../lib/data');
  fs.writeFileSync(path.join(dataPath, 'colleges.json'), JSON.stringify(colleges, null, 2));
  fs.writeFileSync(path.join(dataPath, 'branches.json'), JSON.stringify(branches, null, 2));
  fs.writeFileSync(path.join(dataPath, 'college_branches.json'), JSON.stringify(collegeBranches, null, 2));
  fs.writeFileSync(path.join(dataPath, 'cutoff_data.json'), JSON.stringify(cutoffData, null, 2));

  console.log(`Normalized extraction complete:`);
  console.log(`Colleges: ${colleges.length}`);
  console.log(`Branches: ${branches.length}`);
  console.log(`Cutoff Rows: ${cutoffData.length}`);
}

extractData().catch(err => console.error(err));
