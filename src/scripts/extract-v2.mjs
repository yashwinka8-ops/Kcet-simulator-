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

const categoryList = ["1G", "1K", "1R", "2AG", "2AK", "2AR", "2BG", "2BK", "2BR", "3AG", "3AK", "3AR", "3BG", "3BK", "3BR", "GM", "GMK", "GMR", "SCG", "SCK", "SCR", "STG", "STK", "STR"];

const branchCodeMap = {
    "COMPUTER SCIENCE AND ENGINEERING": "CSE",
    "INFORMATION SCIENCE AND ENGINEERING": "ISE",
    "ARTIFICIAL INTELLIGENCE AND MACHINE LEARNING": "AIML",
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE": "AIDS",
    "COMPUTER SCIENCE AND BUSINESS SYSTEMS": "CSBS",
    "COMPUTER SCIENCE AND ENGINEERING (DATA SCIENCE)": "CSEDS",
    "COMPUTER SCIENCE AND ENGINEERING(DATA SCIENCE)": "CSEDS",
    "CYBER SECURITY": "CYBER",
    "ROBOTICS AND ARTIFICIAL INTELLIGENCE": "RAI",
    "DATA SCIENCE": "DS",
    "INTERNET OF THINGS": "IOT",
    "ELECTRONICS AND COMMUNICATION ENGINEERING": "ECE",
    "ELECTRONICS AND COMMUNICATION ENGG": "ECE",
    "ELECTRICAL AND ELECTRONICS ENGINEERING": "EEE",
    "ELECTRICAL & ELECTRONICS ENGINEERING": "EEE",
    "ELECTRONICS AND INSTRUMENTATION ENGINEERING": "EIE",
    "TELECOMMUNICATION ENGINEERING": "TCE",
    "ELECTRONICS AND COMPUTER ENGINEERING": "ECM",
    "MECHANICAL ENGINEERING": "MECH",
    "CIVIL ENGINEERING": "CIVIL",
    "CHEMICAL ENGINEERING": "CHEM",
    "INDUSTRIAL ENGINEERING AND MANAGEMENT": "IEM",
    "INDUSTRIAL ENGINEERING & MANAGEMENT": "IEM",
    "MANUFACTURING SCIENCE AND ENGINEERING": "MSE",
    "AUTOMOBILE ENGINEERING": "AUTO",
    "MECHATRONICS ENGINEERING": "MEC",
    "AERONAUTICAL ENGINEERING": "AERO",
    "AEROSPACE ENGINEERING": "AS",
    "MARINE ENGINEERING": "MARINE",
    "BIOTECHNOLOGY": "BT",
    "BIOMEDICAL ENGINEERING": "BME",
    "MEDICAL ELECTRONICS": "MED",
    "ENVIRONMENTAL ENGINEERING": "ENV",
    "POLYMER SCIENCE AND TECHNOLOGY": "POLY",
    "SILK TECHNOLOGY": "SILK",
    "CERAMIC TECHNOLOGY": "CERAMIC",
    "MINING ENGINEERING": "MINING",
    "PETROLEUM ENGINEERING": "PETRO",
    "ARCHITECTURE (B.ARCH)": "ARCH",
    "PLANNING ENGINEERING": "PLAN",
    "TEXTILE TECHNOLOGY": "TEXTILE",
    "PRINTING TECHNOLOGY": "PRINT",
    "INSTRUMENTATION TECHNOLOGY": "INST",
    "CONSTRUCTION TECHNOLOGY": "CONSTR",
    "AGRICULTURAL ENGINEERING": "AGRI",
    "FOOD TECHNOLOGY": "FOOD",
    "B.SC NURSING": "NURSING",
    "PHARMACY": "PHARMA",
    "PHYSIOTHERAPY": "PHYSIO",
    "ALLIED HEALTH SCIENCES": "AHS"
};

const districts = [
    "Bagalkot", "Ballari", "Belagavi", "Bengaluru", "Bidar", "Chamarajanagar", 
    "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", 
    "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", 
    "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", 
    "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", 
    "Vijayapura", "Yadgir", "Vijayanagara"
];

const districtMapping = {
    "BANGALORE": "Bengaluru",
    "BENGALURU": "Bengaluru",
    "BELGAUM": "Belagavi",
    "BELLARY": "Ballari",
    "BIJAPUR": "Vijayapura",
    "CHIKMAGALUR": "Chikkamagaluru",
    "CHIKKABALLAPURA": "Chikballapur",
    "CHIKBALLAPUR": "Chikballapur",
    "COORG": "Kodagu",
    "GULBARGA": "Kalaburagi",
    "HAYERI": "Haveri",
    "HUBLI": "Dharwad",
    "MANGALORE": "Dakshina Kannada",
    "MYSORE": "Mysuru",
    "SHIMOGA": "Shivamogga",
    "SHIVAMOGGA": "Shivamogga",
    "TUMKUR": "Tumakuru",
    "TUMAKURU": "Tumakuru",
    "KARWAR": "Uttara Kannada",
    "DAVANGERE": "Davanagere",
    "MANDYA": "Mandya",
    "HASSAN": "Hassan",
    "KOLAR": "Kolar",
    "BIDAR": "Bidar",
    "YADGIR": "Yadgir",
    "CHITRADURGA": "Chitradurga",
    "RAICHUR": "Raichur",
    "KOPPAL": "Koppal"
};

const collegeTierMap = {
    // Tier 1
    "E001": "Tier 1", "E003": "Tier 1", "E005": "Tier 1", "E006": "Tier 1", "E009": "Tier 1", 
    "E021": "Tier 1", "E022": "Tier 1", "E024": "Tier 1", "E057": "Tier 1", "E178": "Tier 1", "E285": "Tier 1",
    // Tier 1.5
    "E007": "Tier 1.5", "E008": "Tier 1.5", "E016": "Tier 1.5", "E036": "Tier 1.5", "E037": "Tier 1.5", 
    "E078": "Tier 1.5", "E079": "Tier 1.5", "E082": "Tier 1.5", "E091": "Tier 1.5", "E092": "Tier 1.5", 
    "E097": "Tier 1.5", "E099": "Tier 1.5", "E103": "Tier 1.5", "E107": "Tier 1.5", "E115": "Tier 1.5", 
    "E118": "Tier 1.5", "E126": "Tier 1.5", "E129": "Tier 1.5", "E141": "Tier 1.5", "E145": "Tier 1.5", 
    "E149": "Tier 1.5", "E150": "Tier 1.5", "E151": "Tier 1.5", "E160": "Tier 1.5", "E169": "Tier 1.5", 
    "E172": "Tier 1.5", "E177": "Tier 1.5", "E201": "Tier 1.5", "E205": "Tier 1.5", "E209": "Tier 1.5", 
    "E212": "Tier 1.5", "E232": "Tier 1.5", "E237": "Tier 1.5", "E240": "Tier 1.5", "E257": "Tier 1.5",
    // Tier 2
    "E004": "Tier 2", "E011": "Tier 2", "E012": "Tier 2", "E014": "Tier 2", "E017": "Tier 2", 
    "E023": "Tier 2", "E031": "Tier 2", "E034": "Tier 2", "E041": "Tier 2", "E054": "Tier 2", 
    "E055": "Tier 2", "E061": "Tier 2", "E062": "Tier 2", "E064": "Tier 2", "E065": "Tier 2", 
    "E071": "Tier 2", "E075": "Tier 2", "E077": "Tier 2", "E083": "Tier 2", "E085": "Tier 2", 
    "E095": "Tier 2", "E096": "Tier 2", "E098": "Tier 2", "E102": "Tier 2", "E104": "Tier 2", 
    "E106": "Tier 2", "E111": "Tier 2", "E113": "Tier 2", "E123": "Tier 2", "E127": "Tier 2", 
    "E130": "Tier 2", "E136": "Tier 2", "E139": "Tier 2", "E144": "Tier 2", "E146": "Tier 2", 
    "E147": "Tier 2", "E158": "Tier 2", "E165": "Tier 2", "E168": "Tier 2", "E173": "Tier 2", 
    "E176": "Tier 2", "E184": "Tier 2", "E185": "Tier 2", "E188": "Tier 2", "E193": "Tier 2", 
    "E204": "Tier 2", "E206": "Tier 2", "E220": "Tier 2", "E222": "Tier 2", "E227": "Tier 2", 
    "E238": "Tier 2", "E252": "Tier 2", "E254": "Tier 2", "E255": "Tier 2", "E286": "Tier 2"
};

function getDistrict(collegeName) {
    const upperName = collegeName.toUpperCase();
    for (const [key, value] of Object.entries(districtMapping)) {
        if (upperName.includes(key)) return value;
    }
    for (const d of districts) {
        if (upperName.includes(d.toUpperCase())) return d;
    }
    return "Other";
}

function getTier(collegeId) {
    return collegeTierMap[collegeId] || "Tier 3";
}

function getRegion(district) {
    const zones = {
        "Bengaluru": ["Bengaluru"],
        "Coastal": ["Dakshina Kannada", "Udupi", "Uttara Kannada"],
        "North": ["Belagavi", "Bagalkot", "Vijayapura", "Bidar", "Kalaburagi", "Yadgir", "Raichur", "Koppal", "Ballari", "Vijayanagara", "Dharwad", "Gadag", "Haveri"],
        "Central": ["Davanagere", "Chitradurga", "Shivamogga", "Chikkamagaluru", "Tumakuru"],
        "South": ["Mysuru", "Mandya", "Hassan", "Chamarajanagar", "Kodagu", "Kolar", "Chikballapur", "Ramanagara"]
    };
    for (const [zone, districtsInZone] of Object.entries(zones)) {
        if (districtsInZone.includes(district)) return zone;
    }
    return "Other";
}

const collegeDataMap = {
    // Tier 1 & Prime
    "E005": { fees: "₹96,000 – ₹1,00,000", avg_package: "₹15.24 – ₹19.73 LPA", highest_package: "₹92.00 LPA" },
    "E009": { fees: "₹1,00,000+", avg_package: "₹15.00 – ₹17.99 LPA", highest_package: "₹68.00 LPA" },
    "E003": { fees: "₹70,000 – ₹96,000", avg_package: "₹11.40 LPA", highest_package: "₹51.50 LPA" },
    "E006": { fees: "₹96,000 – ₹1,33,000", avg_package: "₹7.66 – ₹10.00 LPA", highest_package: "₹58.00 LPA" },
    "E021": { fees: "₹70,000 – ₹96,000", avg_package: "₹7.20 – ₹12.00 LPA", highest_package: "₹44.00 LPA" },
    "E057": { fees: "₹70,000 – ₹96,000", avg_package: "₹7.20 – ₹12.00 LPA", highest_package: "₹44.00 LPA" },
    "E001": { fees: "₹25,000 – ₹45,000", avg_package: "₹7.00 – ₹10.00 LPA", highest_package: "₹58.00 LPA" },
    "E022": { fees: "₹70,000 – ₹96,000", avg_package: "₹10.35 – ₹10.50 LPA", highest_package: "₹56.00 LPA" },
    "E178": { fees: "₹70,000 – ₹96,000", avg_package: "₹10.35 – ₹10.50 LPA", highest_package: "₹56.00 LPA" },
    "E024": { fees: "₹70,000 – ₹90,000", avg_package: "₹6.50 – ₹8.50 LPA", highest_package: "₹32.00 LPA" },
    "E285": { fees: "₹1,00,000+", avg_package: "₹12.00 LPA", highest_package: "₹56.00 LPA" },
    
    // Tier 1.5
    "E007": { fees: "₹96k – ₹1.07L", avg_package: "6.5 – 8.5 LPA", highest_package: "45.0+ LPA" },
    "E008": { fees: "₹96k – ₹1.07L", avg_package: "8.0 – 10.0 LPA", highest_package: "54.0 LPA" },
    "E016": { fees: "₹70k – ₹96k", avg_package: "7.5 – 9.0 LPA", highest_package: "32.8 LPA" },
    "E036": { fees: "₹96k – ₹1.07L", avg_package: "7.0 – 8.0 LPA", highest_package: "43.0 LPA" },
    "E126": { fees: "₹96k – ₹1.07L", avg_package: "8.9 – 9.5 LPA", highest_package: "46.7 LPA" },
    "E099": { fees: "₹96k – ₹1.07L", avg_package: "7.0 – 8.2 LPA", highest_package: "45.0 LPA" },
    "E141": { fees: "₹1.00L+", avg_package: "13.0 – 15.0 LPA", highest_package: "65.0 LPA" },
    "E097": { fees: "₹96k – ₹1.07L", avg_package: "6.5 – 7.0 LPA", highest_package: "44.1 LPA" },
    "E118": { fees: "₹96k – ₹1.07L", avg_package: "6.0 – 7.5 LPA", highest_package: "30.0+ LPA" },
    "E107": { fees: "₹96k – ₹1.07L", avg_package: "6.5 – 7.8 LPA", highest_package: "40.0+ LPA" },
    "E232": { fees: "₹1.00L+", avg_package: "6.0 – 7.0 LPA", highest_package: "50.0+ LPA" },

    // Tier 2
    "E004": { fees: "₹40k – ₹96k", avg_package: "5.0 – 7.0 LPA", highest_package: "29.5 LPA" },
    "E012": { fees: "₹96k – ₹1.07L", avg_package: "5.5 – 6.5 LPA", highest_package: "30.0+ LPA" },
    "E071": { fees: "₹96k – ₹1.07L", avg_package: "5.5 – 6.2 LPA", highest_package: "33.0 LPA" },
    "E065": { fees: "₹70k – ₹96k", avg_package: "4.5 – 5.5 LPA", highest_package: "24.0 LPA" },
    "E034": { fees: "₹96k – ₹1.07L", avg_package: "5.0 – 6.0 LPA", highest_package: "25.0+ LPA" },
    "E023": { fees: "₹40k – ₹96k", avg_package: "4.8 – 5.5 LPA", highest_package: "22.0 LPA" },
    "E011": { fees: "₹96k – ₹1.07L", avg_package: "4.5 – 5.5 LPA", highest_package: "27.0 LPA" },
    "E098": { fees: "₹96k – ₹1.07L", avg_package: "4.2 – 5.0 LPA", highest_package: "30.0 LPA" },
    "E102": { fees: "₹96k – ₹1.07L", avg_package: "4.0 – 5.0 LPA", highest_package: "22.0 LPA" },
    "E160": { fees: "₹96k – ₹1.07L", avg_package: "5.0 – 6.0 LPA", highest_package: "40.0 LPA" }
};

function getCollegeExtraData(collegeId) {
    return collegeDataMap[collegeId] || {
        fees: "N/A",
        avg_package: "N/A",
        highest_package: "N/A"
    };
}

function slugify(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
        .replace(/-of-|-and-|-the-|-in-|-at-/g, '-');
}

function getBranchId(name) {
    const upperName = name.toUpperCase().trim();
    if (branchCodeMap[upperName]) return branchCodeMap[upperName];
    for (const [key, value] of Object.entries(branchCodeMap)) {
        if (upperName.includes(key)) return value;
    }
    const words = name.trim().split(/[\s-]+/); 
    let id = words.map(word => {
        const w = word.toUpperCase().replace(/[^A-Z&]/g, '');
        if (!w) return "";
        if (w === "AND") return "&";
        if (w === "OF" || w === "IN" || w === "THE" || w === "FOR") return "";
        return w[0];
    }).filter(Boolean).join('');
    if (id.includes('&')) id = id.replace('&', ' & ');
    return id;
}

async function extract() {
    const collegesMap = new Map();
    const branchesMap = new Map();

    for (const file of pdfFiles) {
        const filePath = path.join(__dirname, file.path);
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}`);
            continue;
        }

        console.log(`Processing Round ${file.round}...`);
        const dataBuffer = fs.readFileSync(filePath);
        const parser = new PDFParse({ data: dataBuffer });
        const textResult = await parser.getText();
        const text = textResult.text;
        const lines = text.split('\n');

        let currentCollege = null;
        let pendingBranchText = "";

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line || line.includes('Page') || line.includes('Course Name') || line.startsWith('UGCET-')) continue;

            const collegeMatch = line.match(/^College:\s+([E][0-9]{3})\s+(.+)$/);
            if (collegeMatch) {
                const collegeId = collegeMatch[1];
                const collegeName = collegeMatch[2];
                if (!collegesMap.has(collegeId)) {
                    const district = getDistrict(collegeName);
                    collegesMap.set(collegeId, {
                        college_id: collegeId,
                        id: slugify(collegeName.split(',')[0]),
                        name: collegeName.split(',')[0].trim(),
                        full_name: collegeName.trim(),
                        city: district,
                        region: getRegion(district),
                        tier: getTier(collegeId),
                        college_type: collegeName.includes('Government') ? "Government" : "Private",
                        ...getCollegeExtraData(collegeId),
                        kcet_cutoffs: new Map()
                    });
                }
                currentCollege = collegesMap.get(collegeId);
                pendingBranchText = "";
                continue;
            }

            if (!currentCollege) continue;

            const tokens = line.split(/\s+/);
            const rankTokens = tokens.filter(t => /^\d+(\.\d+)?$/.test(t) || t === '--');
            
            if (rankTokens.length >= 8) {
                let firstRankIdx = tokens.findIndex(t => /^\d+(\.\d+)?$/.test(t) || t === '--');
                let extraBranchText = tokens.slice(0, firstRankIdx).join(' ');
                let branchName = (pendingBranchText + " " + extraBranchText).trim();
                if (!branchName) continue;

                const branchId = getBranchId(branchName);
                if (!branchesMap.has(branchId)) {
                    branchesMap.set(branchId, {
                        branch_id: branchId,
                        branch_code: branchId,
                        branch_name: branchName
                    });
                }
                
                rankTokens.forEach((rank, idx) => {
                    if (idx < categoryList.length && rank !== '--') {
                        const category = categoryList[idx];
                        const val = Math.round(parseFloat(rank));
                        const key = `${branchId}|${category}`;
                        if (!currentCollege.kcet_cutoffs.has(key)) {
                            currentCollege.kcet_cutoffs.set(key, {
                                branch_id: branchId,
                                category: category,
                                r1: null, r2: null, r3: null
                            });
                        }
                        currentCollege.kcet_cutoffs.get(key)[`r${file.round}`] = val;
                    }
                });
                pendingBranchText = "";
            } else {
                if (line.length > 3 && !line.match(/^[0-9.-]+$/)) {
                    pendingBranchText += " " + line;
                }
            }
        }
    }

    const legacyColleges = [];
    const legacyBranches = Array.from(branchesMap.values());
    const legacyCollegeBranches = [];
    const legacyCutoffData = [];

    const finalColleges = Array.from(collegesMap.values()).map(c => {
        const college = {
            college_id: c.college_id,
            id: c.id,
            name: c.name,
            full_name: c.full_name,
            city: c.city,
            region: c.region,
            tier: c.tier,
            college_type: c.college_type,
            fees: c.fees,
            avg_package: c.avg_package,
            highest_package: c.highest_package,
            kcet_cutoffs: Array.from(c.kcet_cutoffs.values())
        };
        
        if (college.name.includes('Acharya Institute of Technology')) {
            college.id = "acharya-institute-technology";
        }

        legacyColleges.push({
            college_id: c.college_id,
            short_name: c.name.split(' ')[0],
            full_name: c.full_name,
            city: c.city,
            region: c.region,
            tier: c.tier,
            college_type: c.college_type,
            naac_grade: "A",
            fees: c.fees,
            avg_package: c.avg_package,
            highest_package: c.highest_package
        });

        const addedBranches = new Set();
        college.kcet_cutoffs.forEach(co => {
            const cbId = `${c.college_id}-${co.branch_id}`;
            if (!addedBranches.has(co.branch_id)) {
                legacyCollegeBranches.push({
                    id: cbId,
                    college_id: c.college_id,
                    branch_id: co.branch_id
                });
                addedBranches.add(co.branch_id);
            }
            [1, 2, 3].forEach(r => {
                const rank = co[`r${r}`];
                if (rank) {
                    legacyCutoffData.push({
                        id: `${cbId}-${co.category}-${r}-2024`,
                        college_branch_id: cbId,
                        category: co.category,
                        gender: "Male",
                        round: r,
                        year: 2024,
                        hk_quota: co.category.includes('K'),
                        closing_rank: rank
                    });
                }
            });
        });

        return college;
    });

    const unifiedData = {
        colleges: finalColleges,
        branches: legacyBranches
    };

    const outDir = path.join(__dirname, '../lib/data');
    fs.writeFileSync(path.join(outDir, 'colleges_unified.json'), JSON.stringify(unifiedData, null, 2));
    fs.writeFileSync(path.join(outDir, 'colleges.json'), JSON.stringify(legacyColleges, null, 2));
    fs.writeFileSync(path.join(outDir, 'branches.json'), JSON.stringify(legacyBranches, null, 2));
    fs.writeFileSync(path.join(outDir, 'college_branches.json'), JSON.stringify(legacyCollegeBranches, null, 2));
    fs.writeFileSync(path.join(outDir, 'cutoff_data.json'), JSON.stringify(legacyCutoffData, null, 2));
    
    console.log(`Extraction complete. Saved unified and legacy files.`);
}

extract().catch(err => console.error(err));
