const fs = require('fs');
const path = require('path');
const { jsPDF } = require('jspdf');
const { default: autoTable } = require('jspdf-autotable');

// Load data
const JSON_PATH = path.join(__dirname, '../src/lib/data/all_data.json');
const rawData = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// Map branch IDs to full names
const bMap = {};
rawData.branches.forEach(b => {
    bMap[b.branch_id] = b.branch_name;
});

const userRank = 8892;
const targetCategory = '3AR';
const eligibleCategories = ['GM', 'GMR', '3AG', '3AR'];

// Group cutoffs by college and branch, then find the max cutoff for eligible categories per round
const collegeBranchMap = {};

rawData.colleges.forEach(col => {
    if (!col.kcet_cutoffs) return;
    
    col.kcet_cutoffs.forEach(cutoffInfo => {
        if (eligibleCategories.includes(cutoffInfo.category)) {
            const key = `${col.college_id}:::${cutoffInfo.branch_id}`;
            if (!collegeBranchMap[key]) {
                collegeBranchMap[key] = {
                    college_id: col.college_id,
                    college_name: col.full_name || col.name || col.college_name || '',
                    branch_id: cutoffInfo.branch_id,
                    branch_name: bMap[cutoffInfo.branch_id] || cutoffInfo.branch_id,
                    mock: 0,
                    r1: 0,
                    r2: 0,
                    r3: 0,
                    mock_cat: '-',
                    r1_cat: '-',
                    r2_cat: '-',
                    r3_cat: '-'
                };
            }
            
            const rounds = ['mock', 'r1', 'r2', 'r3'];
            rounds.forEach(round => {
                const val = cutoffInfo[round];
                if (val !== null && typeof val === 'number' && val > 0) {
                    if (val > collegeBranchMap[key][round]) {
                        collegeBranchMap[key][round] = val;
                        collegeBranchMap[key][round + '_cat'] = cutoffInfo.category;
                    }
                }
            });
        }
    });
});

const results = [];
Object.values(collegeBranchMap).forEach(item => {
    // A seat can be allotted if cutoff in r1, r2, or r3 is >= 8892
    const isEligible = (item.r1 && item.r1 >= userRank) || 
                       (item.r2 && item.r2 >= userRank) || 
                       (item.r3 && item.r3 >= userRank);
                       
    if (isEligible) {
        // Find representative cutoff (R3, else R2, else R1)
        const repCutoff = item.r3 || item.r2 || item.r1;
        const repCat = item.r3 ? item.r3_cat : (item.r2 ? item.r2_cat : item.r1_cat);
        
        let type = 'Safe';
        if (repCutoff >= userRank && repCutoff <= 11000) {
            type = 'Dream';
        } else if (repCutoff > 11000 && repCutoff <= 18000) {
            type = 'Moderate';
        }
        
        results.push({
            college_id: item.college_id,
            college_name: item.college_name,
            branch_id: item.branch_id,
            branch_name: item.branch_name,
            mock: item.mock || '-',
            mock_cat: item.mock_cat,
            r1: item.r1 || '-',
            r1_cat: item.r1_cat,
            r2: item.r2 || '-',
            r2_cat: item.r2_cat,
            r3: item.r3 || '-',
            r3_cat: item.r3_cat,
            type: type,
            repCutoff: repCutoff,
            repCat: repCat
        });
    }
});

// Sort: Dream first, then Moderate, then Safe. Within each group, sort by representative cutoff ascending
const typeOrder = { 'Dream': 1, 'Moderate': 2, 'Safe': 3 };
results.sort((a, b) => {
    if (typeOrder[a.type] !== typeOrder[b.type]) {
        return typeOrder[a.type] - typeOrder[b.type];
    }
    return a.repCutoff - b.repCutoff;
});

// Create public directory if not exists
const publicDir = path.join(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
}

// ----------------------------------------------------
// 1. GENERATE CSV REPORT (DETAILED AND DYNAMIC)
// ----------------------------------------------------
const csvHeaders = [
    'College Code', 
    'College Name', 
    'Branch Code', 
    'Branch Name', 
    'Mock Cutoff', 
    'Mock Allotment Category',
    'Round 1 Cutoff', 
    'Round 1 Allotment Category',
    'Round 2 Cutoff', 
    'Round 2 Allotment Category',
    'Round 3 Cutoff', 
    'Round 3 Allotment Category',
    'Best Representative Cutoff',
    'Best Representative Category',
    'Chance Category'
];

const csvRows = [csvHeaders.join(',')];

results.forEach(row => {
    const csvValues = [
        row.college_id,
        row.college_name,
        row.branch_id,
        row.branch_name,
        row.mock,
        row.mock_cat,
        row.r1,
        row.r1_cat,
        row.r2,
        row.r2_cat,
        row.r3,
        row.r3_cat,
        row.repCutoff,
        row.repCat,
        row.type
    ].map(val => {
        const valStr = String(val);
        if (valStr.includes(',') || valStr.includes('"') || valStr.includes('\n')) {
            return `"${valStr.replace(/"/g, '""')}"`;
        }
        return valStr;
    });
    csvRows.push(csvValues.join(','));
});

const csvPathPublic = path.join(publicDir, `KCET_Colleges_3AR_8892.csv`);
const csvPathRoot = path.join(__dirname, '../KCET_Colleges_3AR_8892.csv');

fs.writeFileSync(csvPathPublic, csvRows.join('\n'), 'utf8');
fs.writeFileSync(csvPathRoot, csvRows.join('\n'), 'utf8');
console.log('CSV Reports generated successfully!');

// ----------------------------------------------------
// 2. GENERATE PDF REPORT (PREMIUM DESIGN WITH MERGED LOGIC)
// ----------------------------------------------------
const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
});

const pageWidth = doc.internal.pageSize.width; // 210mm
const pageHeight = doc.internal.pageSize.height; // 297mm
const margin = 14;

// Helper: draw Header and Background bar
function drawHeader(doc) {
    // Top banner
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(0, 0, pageWidth, 35, 'F');
    
    // Draw Logo Badge
    doc.setFillColor(225, 29, 72); // Rose-500
    doc.roundedRect(margin, 8, 12, 12, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('KCET', margin + 2, 15);
    doc.text('PRED', margin + 2, 18);
    
    // Header Title
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('KCET MERGED ALLOTMENT REPORT', margin + 16, 16);
    
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.setFont('helvetica', 'normal');
    doc.text('Smart Category Allotment: Includes GM, GMR, 3AG, and 3AR rules', margin + 16, 22);

    // Right Side Metadata
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    doc.text(`DATE: ${dateStr}`, pageWidth - margin, 14, { align: 'right' });
    doc.text(`RANK: ${userRank}`, pageWidth - margin, 18, { align: 'right' });
    doc.text(`CATEGORY: 3AR (Rural Candidate)`, pageWidth - margin, 22, { align: 'right' });
}

// Draw Header on first page
drawHeader(doc);

// Section 1: Candidate Profile Card
let currentY = 40;
doc.setFillColor(248, 250, 252); // Slate-50
doc.setDrawColor(226, 232, 240); // Slate-200
doc.roundedRect(margin, currentY, pageWidth - (margin * 2), 24, 2, 2, 'FD');

doc.setFont('helvetica', 'bold');
doc.setFontSize(9);
doc.setTextColor(30, 41, 59); // Slate-800
doc.text('CANDIDATE ADMISSION PROFILE', margin + 5, currentY + 6);

doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 116, 139); // Slate-500
doc.setFontSize(8);
doc.text('Rank:', margin + 5, currentY + 13);
doc.setFont('helvetica', 'bold');
doc.setTextColor(225, 29, 72); // Rose-500
doc.text(`${userRank}`, margin + 14, currentY + 13);

doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 116, 139);
doc.text('Claimed Category:', margin + 36, currentY + 13);
doc.setFont('helvetica', 'bold');
doc.setTextColor(30, 41, 59);
doc.text(`${targetCategory} (3A Rural)`, margin + 61, currentY + 13);

doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 116, 139);
doc.text('Allotment Logic Applied:', margin + 89, currentY + 13);
doc.setFont('helvetica', 'bold');
doc.setTextColor(30, 41, 59);
doc.text('Merged (GM, GMR, 3AG, 3AR)', margin + 121, currentY + 13);

doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 116, 139);
doc.text('Total Options Found:', margin + 5, currentY + 19);
doc.setFont('helvetica', 'bold');
doc.setTextColor(16, 185, 129); // Emerald-500
doc.text(`${results.length} colleges & branches`, margin + 32, currentY + 19);

doc.setFont('helvetica', 'normal');
doc.setTextColor(100, 116, 139);
doc.text('Full Database CSV File:', margin + 89, currentY + 19);
doc.setFont('helvetica', 'bold');
doc.setTextColor(16, 185, 129);
doc.text('KCET_Colleges_3AR_8892.csv (Generated)', margin + 121, currentY + 19);

currentY += 30;

// Section 2: Summary stats box
doc.setFont('helvetica', 'bold');
doc.setFontSize(10);
doc.setTextColor(30, 41, 59);
doc.text('CHANCE DISTRIBUTION SUMMARY', margin, currentY);
currentY += 4;

const dreamCount = results.filter(r => r.type === 'Dream').length;
const moderateCount = results.filter(r => r.type === 'Moderate').length;
const safeCount = results.filter(r => r.type === 'Safe').length;

// Draw mini info cards side-by-side
const cardWidth = (pageWidth - (margin * 2) - 8) / 3;

// Dream Card
doc.setFillColor(254, 242, 242); // Rose-50
doc.setDrawColor(254, 202, 202); // Rose-200
doc.roundedRect(margin, currentY, cardWidth, 14, 1.5, 1.5, 'FD');
doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.setTextColor(185, 28, 28); // Rose-700
doc.text('DREAM OPTIONS (8892 - 11000)', margin + 3, currentY + 5);
doc.setFontSize(11);
doc.text(`${dreamCount}`, margin + 3, currentY + 11);

// Moderate Card
doc.setFillColor(255, 251, 235); // Amber-50
doc.setDrawColor(253, 230, 138); // Amber-200
doc.roundedRect(margin + cardWidth + 4, currentY, cardWidth, 14, 1.5, 1.5, 'FD');
doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.setTextColor(180, 83, 9); // Amber-700
doc.text('MODERATE OPTIONS (11001 - 18000)', margin + cardWidth + 7, currentY + 5);
doc.setFontSize(11);
doc.text(`${moderateCount}`, margin + cardWidth + 7, currentY + 11);

// Safe Card
doc.setFillColor(240, 253, 250); // Emerald-50
doc.setDrawColor(153, 246, 228); // Emerald-200
doc.roundedRect(margin + (cardWidth * 2) + 8, currentY, cardWidth, 14, 1.5, 1.5, 'FD');
doc.setFont('helvetica', 'bold');
doc.setFontSize(7.5);
doc.setTextColor(4, 120, 87); // Emerald-700
doc.text('SAFE OPTIONS (> 18000)', margin + (cardWidth * 2) + 11, currentY + 5);
doc.setFontSize(11);
doc.text(`${safeCount}`, margin + (cardWidth * 2) + 11, currentY + 11);

currentY += 20;

// Filter tables for PDF
const pdfDream = results.filter(r => r.type === 'Dream');
const pdfModerate = results.filter(r => r.type === 'Moderate');
const pdfSafe = results.filter(r => r.type === 'Safe').slice(0, 20); // Top 20 Safe options

// Format cutoff cells to show value + category in brackets, e.g. "9340 (GMR)"
const formatCell = (val, cat) => {
    if (val === '-') return '-';
    return `${val.toLocaleString()} (${cat})`;
};

// Draw tables
// Section: Dream Options
if (pdfDream.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(185, 28, 28); // Rose-700
    doc.text('🎯 DREAM OPTIONS (Highly Competitive - Realistic Chance via Merged Logic)', margin, currentY);
    currentY += 3;
    
    const bodyData = pdfDream.map(item => [
        item.college_id,
        item.college_name,
        item.branch_id,
        item.branch_name,
        formatCell(item.mock, item.mock_cat),
        formatCell(item.r1, item.r1_cat),
        formatCell(item.r2, item.r2_cat),
        formatCell(item.r3, item.r3_cat)
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Code', 'College Name', 'Branch', 'Branch Specialization', 'Mock', 'Round 1', 'Round 2', 'Round 3 (Final)']],
        body: bodyData,
        theme: 'grid',
        headStyles: {
            fillColor: [225, 29, 72], // Rose-500
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 6.5,
            textColor: [51, 65, 85],
            cellPadding: 2
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
            1: { cellWidth: 55 },
            2: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
            3: { cellWidth: 42 },
            4: { halign: 'center', cellWidth: 16 },
            5: { halign: 'center', cellWidth: 16 },
            6: { halign: 'center', cellWidth: 16 },
            7: { halign: 'center', cellWidth: 16, fontStyle: 'bold', textColor: [225, 29, 72] }
        },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
            currentY = data.cursor.y;
        }
    });
    
    currentY += 8;
}

// Section: Moderate Options
if (pdfModerate.length > 0) {
    if (currentY > pageHeight - 40) {
        doc.addPage();
        drawHeader(doc);
        currentY = 40;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(180, 83, 9); // Amber-700
    doc.text('⚖️ MODERATE OPTIONS (Strong Admission Probabilities)', margin, currentY);
    currentY += 3;
    
    const bodyData = pdfModerate.map(item => [
        item.college_id,
        item.college_name,
        item.branch_id,
        item.branch_name,
        formatCell(item.mock, item.mock_cat),
        formatCell(item.r1, item.r1_cat),
        formatCell(item.r2, item.r2_cat),
        formatCell(item.r3, item.r3_cat)
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Code', 'College Name', 'Branch', 'Branch Specialization', 'Mock', 'Round 1', 'Round 2', 'Round 3 (Final)']],
        body: bodyData,
        theme: 'grid',
        headStyles: {
            fillColor: [245, 158, 11], // Amber-500
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 6.5,
            textColor: [51, 65, 85],
            cellPadding: 2
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
            1: { cellWidth: 55 },
            2: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
            3: { cellWidth: 42 },
            4: { halign: 'center', cellWidth: 16 },
            5: { halign: 'center', cellWidth: 16 },
            6: { halign: 'center', cellWidth: 16 },
            7: { halign: 'center', cellWidth: 16, fontStyle: 'bold', textColor: [180, 83, 9] }
        },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
            currentY = data.cursor.y;
        }
    });
    
    currentY += 8;
}

// Section: Top Safe Options
if (pdfSafe.length > 0) {
    if (currentY > pageHeight - 40) {
        doc.addPage();
        drawHeader(doc);
        currentY = 40;
    }
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(4, 120, 87); // Emerald-700
    doc.text('🛡️ TOP SAFE OPTIONS (Assured Admission - Top 20 Shown)', margin, currentY);
    currentY += 3;
    
    const bodyData = pdfSafe.map(item => [
        item.college_id,
        item.college_name,
        item.branch_id,
        item.branch_name,
        formatCell(item.mock, item.mock_cat),
        formatCell(item.r1, item.r1_cat),
        formatCell(item.r2, item.r2_cat),
        formatCell(item.r3, item.r3_cat)
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Code', 'College Name', 'Branch', 'Branch Specialization', 'Mock', 'Round 1', 'Round 2', 'Round 3 (Final)']],
        body: bodyData,
        theme: 'grid',
        headStyles: {
            fillColor: [16, 185, 129], // Emerald-500
            textColor: [255, 255, 255],
            fontSize: 7,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 6.5,
            textColor: [51, 65, 85],
            cellPadding: 2
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10, fontStyle: 'bold' },
            1: { cellWidth: 55 },
            2: { halign: 'center', cellWidth: 12, fontStyle: 'bold' },
            3: { cellWidth: 42 },
            4: { halign: 'center', cellWidth: 16 },
            5: { halign: 'center', cellWidth: 16 },
            6: { halign: 'center', cellWidth: 16 },
            7: { halign: 'center', cellWidth: 16, fontStyle: 'bold', textColor: [4, 120, 87] }
        },
        margin: { left: margin, right: margin },
        didDrawPage: (data) => {
            currentY = data.cursor.y;
        }
    });
}

// Draw Footers on all pages and add page numbering
const totalPages = doc.getNumberOfPages();
for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Line separator
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
    
    // Page count
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
    
    // Disclaimer / Note
    doc.text('Note: The full database of all 1,504 options is exported in the accompanying CSV file.', margin, pageHeight - 11);
    doc.setFont('helvetica', 'bold');
    doc.text('KCET INTELLIGENT ALLOTMENT TRACKER • 2026 REPORT', margin, pageHeight - 7);
}

const pdfPathPublic = path.join(publicDir, `KCET_Prediction_Report_8892_3AR.pdf`);
const pdfPathRoot = path.join(__dirname, '../KCET_Prediction_Report_8892_3AR.pdf');

// Save the PDF
doc.save(pdfPathPublic);
doc.save(pdfPathRoot);

console.log('PDF Reports updated successfully with merged category logic!');
