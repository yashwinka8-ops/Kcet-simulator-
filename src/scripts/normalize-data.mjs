import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rawDataPath = path.join(__dirname, '../lib/cutoff-data.json');
const outputDir = path.join(__dirname, '../lib/data');

const branchMapping = {
    'COMPUTER SCIENCE AND ENGINEERING': 'COMP',
    'B TECH IN COMPUTER SCIENCE AND ENGINEERING': 'COMP',
    'COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)': 'DATS',
    'COMPUTER SCIENCE AND ENGG(ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING)': 'AIML',
    'ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING': 'AIML',
    'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE': 'ARTI',
    'INFORMATION SCIENCE AND ENGINEERING': 'INFO',
    'ELECTRONICS AND COMMUNICATION ENGG': 'ELEC',
    'ELECTRICAL & ELECTRONICS ENGINEERING': 'ELEE',
    'MECHANICAL ENGINEERING': 'MECH',
    'CIVIL ENGINEERING': 'CIVI',
    'BIOTECHNOLOGY': 'BIOT',
    'AERONAUTICAL ENGINEERING': 'AERO',
    'INDUSTRIAL ENGINEERING & MANAGEMENT': 'INDU',
    'CHEMICAL': 'CHEM',
    'AUTOMOBILE': 'AUTO',
    'MEDICAL ELECTRONICS ENGINEERING': 'MEDI',
    'ROBOTICS AND ARTIFICIAL INTELLIGENCE': 'ROBO',
    'COMPUTER SCIENCE AND ENGINEERING (CYBER SECURITY)': 'CYBE',
    'TEXTILES': 'TEXT',
};

const cityToRegion = {
    'BENGALURU': 'Bengaluru',
    'BANGALORE': 'Bengaluru',
    'MYSURU': 'Mysuru',
    'MYSORE': 'Mysuru',
    'MANGALURU': 'Coastal',
    'MANGALORE': 'Coastal',
    'SURATHKAL': 'Coastal',
    'UDUPI': 'Coastal',
    'MANIPAL': 'Coastal',
    'HUBBALLI': 'North',
    'HUBLI': 'North',
    'DHARWAD': 'North',
    'BELAGAVI': 'North',
    'BELGAUM': 'North',
    'KALABURAGI': 'North',
    'GULBARGA': 'North',
    'VIJAYAPURA': 'North',
    'BIJAPUR': 'North',
    'DAVANGERE': 'Central',
    'SHIVAMOGGA': 'Central',
    'SHIMOGA': 'Central',
    'TUMAKURU': 'Central',
    'TUMKUR': 'Central',
    'BALLARI': 'North',
    'BELLARY': 'North',
    'BAGALKOT': 'North',
    'GADAG': 'North',
};

function extractCity(collegeName, existingCity) {
    if (existingCity && existingCity !== 'Other') return existingCity;
    const upperName = collegeName.toUpperCase();
    for (const city of Object.keys(cityToRegion)) {
        if (upperName.includes(city)) return city.charAt(0) + city.slice(1).toLowerCase();
    }
    return 'Other';
}

function cleanBranchName(name) {
    if (!name) return "";
    let clean = name.trim().toUpperCase();
    
    // JUNK DETECTION: If it looks like an address, site number, or has too many digits/special chars, discard
    if (clean.includes('SITE NO') || 
        clean.includes('CAMPUS') || 
        clean.includes('TQ-') || 
        clean.includes('ROAD') || 
        clean.match(/\d{4,}/) || // 4+ consecutive digits (likely pin code/phone)
        clean.length > 50 || 
        clean.length < 2) {
        return null;
    }

    // Remove common prefixes
    clean = clean.replace(/^B\s?TECH\s+IN\s+/i, '');
    clean = clean.replace(/^BE\s+IN\s+/i, '');
    
    // Remove leading numbers and special chars
    clean = clean.replace(/^[\d\s\-\.\/]+/, '');
    
    // Fix specific artifacts
    if (clean.includes('COMPUTER SCIENCE AND ENGINEERING')) return 'Computer Science';
    if (clean.includes('INFORMATION SCIENCE AND ENGINEERING')) return 'Information Science';
    if (clean.includes('ELECTRONICS AND COMMUNICATION ENGG')) return 'Electronics (ECE)';
    if (clean.includes('ELECTRICAL & ELECTRONICS ENGINEERING')) return 'Electrical (EEE)';
    if (clean === 'MECHANICAL ENGINEERING') return 'Mechanical';
    if (clean === 'CIVIL ENGINEERING') return 'Civil';
    if (clean.includes('MATHEMATICS AND COMPUTING') || clean.includes('MATHAMATICS')) return 'Mathematics and Computing';
    if (clean === 'ARTIFICIAL INTELLIGENCE AND DATA SCIENCE') return 'AI & Data Science';
    if (clean.includes('ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING')) return 'AI & Machine Learning';
    
    // Final check: if after cleaning it's empty or too long, discard
    if (!clean || clean.length > 40) return null;

    // Capitalize first letter of each word, but keep common acronyms capitalized
    const acronyms = ['CSE', 'ECE', 'EEE', 'ISE', 'AIML', 'DS', 'AI', 'ML'];
    return clean.split(' ').map(w => {
        if (acronyms.includes(w.toUpperCase())) return w.toUpperCase();
        return w.charAt(0) + w.slice(1).toLowerCase();
    }).join(' ');
}

function cleanCollegeName(name) {
    if (!name) return "";
    let clean = name.trim();
    clean = clean.split(',')[0];
    clean = clean.split('(')[0];
    clean = clean.replace(/\s+Bangalore.*/i, '');
    clean = clean.replace(/\s+Bengaluru.*/i, '');
    return clean.trim();
}

function normalizeData() {
    console.log('Loading raw data...');
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf8'));
    const colleges = new Map();
    const branches = new Map();
    const collegeBranches = new Map();
    const cutoffs = [];

    console.log('Processing rows...');
    for (const row of rawData) {
        if (!row.college_id || !row.branch_name) continue;

        if (!colleges.has(row.college_id)) {
            const cleanedFullName = cleanCollegeName(row.college_name);
            const city = extractCity(row.college_name, row.city);
            const region = cityToRegion[city.toUpperCase()] || 'Other';

            colleges.set(row.college_id, {
                college_id: row.college_id,
                short_name: cleanedFullName.split(' ')[0],
                full_name: cleanedFullName,
                city: city,
                region: region,
                college_type: row.college_type,
                naac_grade: row.naac_grade,
                fees: row.fees || 0,
                avg_package: row.avg_package || 5,
                highest_package: row.highest_package || 10
            });
        }

        const cleanedName = cleanBranchName(row.branch_name.trim());
        if (!cleanedName) continue; // Skip junk

        let branchId = branchMapping[cleanedName.toUpperCase()] || cleanedName.substring(0, 4).toUpperCase();


        if (!branches.has(branchId)) {
            branches.set(branchId, {
                branch_id: branchId,
                branch_code: branchId,
                branch_name: cleanedName
            });
        }

        const cbId = `${row.college_id}-${branchId}`;
        if (!collegeBranches.has(cbId)) {
            collegeBranches.set(cbId, {
                id: cbId,
                college_id: row.college_id,
                branch_id: branchId
            });
        }

        cutoffs.push({
            id: `${cbId}-${row.category}-${row.round}-${row.year}`,
            college_branch_id: cbId,
            category: row.category,
            gender: row.gender,
            round: row.round,
            year: row.year,
            hk_quota: row.hk_quota,
            closing_rank: row.closing_rank
        });
    }

    console.log('Writing normalized files...');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, 'colleges.json'), JSON.stringify(Array.from(colleges.values()), null, 2));
    fs.writeFileSync(path.join(outputDir, 'branches.json'), JSON.stringify(Array.from(branches.values()), null, 2));
    fs.writeFileSync(path.join(outputDir, 'college_branches.json'), JSON.stringify(Array.from(collegeBranches.values()), null, 2));
    fs.writeFileSync(path.join(outputDir, 'cutoff_data.json'), JSON.stringify(cutoffs, null, 2));

    console.log('Normalization complete!');
}

normalizeData();
