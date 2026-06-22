import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportAllotmentToPDF = (
    allotment: any,
    candidateInfo: { name: string; cetNo: string; rank: string; category?: string }
) => {
    // Custom size matching the image proportion (roughly 800x500 points)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [800, 500] });
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 40;

    // Outer border
    doc.setDrawColor(220, 220, 220);
    doc.rect(15, 15, pageWidth - 30, doc.internal.pageSize.height - 30);

    // --- 1. CONGRATULATIONS BOX ---
    doc.setFillColor(212, 237, 218); // Light green background
    doc.rect(30, currentY, pageWidth - 60, 40, 'F');
    
    doc.setFontSize(14);
    doc.setTextColor(13, 110, 253); // Blue text
    doc.setFont('helvetica', 'bold');
    doc.text('CONGRATULATIONS', pageWidth / 2, currentY + 25, { align: 'center' });
    
    currentY += 50;

    // --- 2. HEADER BOX ---
    doc.setFillColor(25, 135, 84); // Dark green
    doc.rect(30, currentY, pageWidth - 60, 30, 'F');
    
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    const today = new Date();
    const dateStr = `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
    doc.text(`UGCET/NEET -2026 MOCK ALLOTMENT RESULTS DT: ${dateStr}`, pageWidth / 2, currentY + 20, { align: 'center' });

    currentY += 40;

    // --- 3. DETAILS TABLE ---
    const leftColX = 40;
    const rightColX = 180;
    const lineSpacing = 22;

    doc.setFontSize(10);
    
    const printRow = (label: string, value: string, isBlue = false) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(50, 50, 50);
        doc.text(label, leftColX, currentY);
        
        doc.setFont('helvetica', 'normal');
        if (isBlue) {
            doc.setTextColor(13, 110, 253);
        } else {
            doc.setTextColor(50, 50, 50);
        }
        
        // Handle long college names
        const splitValue = doc.splitTextToSize(value, pageWidth - rightColX - 40);
        doc.text(splitValue, rightColX, currentY);
        
        currentY += splitValue.length * lineSpacing - (lineSpacing - 18);
    };

    printRow('CET No:', candidateInfo.cetNo);
    printRow('Name of the Candidate:', candidateInfo.name.toUpperCase());
    printRow('Verified Category:', candidateInfo.category || '2AG', true);
    printRow('Rank:', `Engineering - ${candidateInfo.rank}.00000000`, true);
    printRow('Discipline:', 'Engineering', true);
    
    if (allotment) {
        printRow('College Allotted:', allotment.collegeName?.toUpperCase() || '', true);
        printRow('Course Allotted:', `${allotment.branchName?.toUpperCase()} (${allotment.branchId})`, true);
        printRow('Category Allotted:', allotment.allottedCategory || 'GM', true);
        printRow('Allotted Option Serial No:', allotment.choiceNo?.toString() || '', true);
        printRow('Course Fees:', allotment.collegeFees?.replace(/,/g, '') || '0', true);
    } else {
        printRow('College Allotted:', 'NO SEAT ALLOTTED', true);
        printRow('Course Allotted:', 'N/A', true);
        printRow('Category Allotted:', 'N/A', true);
        printRow('Allotted Option Serial No:', 'N/A', true);
        printRow('Course Fees:', '0', true);
    }

    doc.save(`KEA_Allotment_Result_${candidateInfo.cetNo}.pdf`);
};

export const exportMultiRoundReportToPDF = (
    roundsData: { roundLabel: string; allotment: any }[],
    candidateInfo: { name: string; cetNo: string; rank: string; category: string }
) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- PARTS 1 to N: INDIVIDUAL ROUND DETAILS (1 page per round) ---
    roundsData.forEach((item, index) => {
        if (index > 0) {
            doc.addPage();
        }

        const alt = item.allotment;
        const roundTitle = item.roundLabel.toUpperCase();

        // 1. Outer Border
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.4);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

        // 2. Premium Header Bar for the Round
        doc.setFillColor(15, 23, 42); // Slate-900
        doc.rect(8, 8, pageWidth - 16, 28, 'F');

        // Logo / Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text('KARNATAKA EXAMINATIONS AUTHORITY', 14, 18);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(148, 163, 184); // Slate-400
        const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        doc.text(`UGCET simulated allotment report  |  Generated: ${dateStr}`, 14, 25);

        // Right side badge for round
        doc.setFillColor(25, 135, 84); // KEA green
        doc.roundedRect(pageWidth - 14 - 38, 13, 38, 12, 1.5, 1.5, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(255, 255, 255);
        doc.text(`${roundTitle} RESULT`, pageWidth - 14 - 19, 21.2, { align: 'center' });

        let currentY = 46;

        // 3. Congratulations / Status Alert Box
        const hasAllotment = !!alt;
        if (hasAllotment) {
            doc.setFillColor(232, 245, 233); // Very light green
            doc.setDrawColor(200, 230, 201);
            doc.roundedRect(14, currentY, pageWidth - 28, 16, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(25, 135, 84);
            doc.text('CONGRATULATIONS! SEAT ALLOTTED IN THIS ROUND', pageWidth / 2, currentY + 10.5, { align: 'center' });
        } else {
            doc.setFillColor(255, 235, 235); // Very light red
            doc.setDrawColor(255, 205, 205);
            doc.roundedRect(14, currentY, pageWidth - 28, 16, 2, 2, 'FD');
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9.5);
            doc.setTextColor(211, 47, 47);
            doc.text('NO SEAT ALLOTTED IN THIS ROUND', pageWidth / 2, currentY + 10.5, { align: 'center' });
        }

        currentY += 26;

        // 4. Candidate Details Sub-Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42); // Slate-900
        doc.text('CANDIDATE ADMISSION PROFILE', 14, currentY);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(14, currentY + 2.5, pageWidth - 14, currentY + 2.5);

        currentY += 8;

        // Details grid layout
        const drawRow = (label: string, value: string, highlightColor?: [number, number, number]) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(8.5);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.text(label, 16, currentY);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(9);
            if (highlightColor) {
                doc.setTextColor(highlightColor[0], highlightColor[1], highlightColor[2]);
            } else {
                doc.setTextColor(30, 41, 59); // Slate-800
            }
            
            // Check value wrapping
            const splitVal = doc.splitTextToSize(value, pageWidth - 75);
            doc.text(splitVal, 68, currentY);
            
            currentY += (splitVal.length * 5) + 2;
        };

        drawRow('CET Number:', candidateInfo.cetNo);
        drawRow('Candidate Name:', candidateInfo.name.toUpperCase());
        drawRow('General Rank:', `${candidateInfo.rank}.00000000`, [13, 110, 253]); // Blue highlight
        drawRow('Verified Category:', candidateInfo.category);
        drawRow('Discipline:', 'Engineering', [25, 135, 84]);

        currentY += 6;

        // 5. Allotment Details Sub-Header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(15, 23, 42);
        doc.text('ALLOTMENT DETAILS', 14, currentY);
        doc.line(14, currentY + 2.5, pageWidth - 14, currentY + 2.5);

        currentY += 8;

        if (hasAllotment) {
            drawRow('Allotted College:', `${alt.collegeName} (${alt.collegeId})`);
            drawRow('Allotted Course:', `${alt.branchName} (${alt.branchId})`);
            drawRow('Allotted Category (Quota):', alt.allottedCategory || 'GM', [25, 135, 84]);
            drawRow('Allotted Option Serial No:', alt.choiceNo?.toString() || 'N/A', [13, 110, 253]);
            drawRow('Course Fees:', `Rs. ${alt.fees || '0'}`, [15, 23, 42]);
            drawRow('Cutoff Rank of Seat:', alt.cutoffRank ? `${alt.cutoffRank.toLocaleString()}` : 'N/A');
        } else {
            drawRow('Allotted College:', 'NO SEAT ALLOTTED');
            drawRow('Allotted Course:', 'N/A');
            drawRow('Allotted Category (Quota):', 'N/A');
            drawRow('Allotted Option Serial No:', 'N/A');
            drawRow('Course Fees:', 'Rs. 0');
            drawRow('Cutoff Rank of Seat:', 'N/A');
        }

        // Draw a clean watermarked footer on each page
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(226, 232, 240);
        doc.text('KEA SIMULATOR OFFICIAL REPORT', pageWidth / 2, pageHeight - 12, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(`Page ${index + 1} of ${roundsData.length + 1}`, pageWidth - 14, pageHeight - 12, { align: 'right' });
    });

    // --- FINAL PAGE: COMPILATION / ALL-IN-ONE SUMMARY TABLE ---
    doc.addPage();
    const finalPageNum = roundsData.length + 1;

    // 1. Outer Border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.4);
    doc.rect(8, 8, pageWidth - 16, pageHeight - 16);

    // 2. Premium Header Bar for final page
    doc.setFillColor(15, 23, 42); // Slate-900
    doc.rect(8, 8, pageWidth - 16, 28, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(255, 255, 255);
    doc.text('KEA UGCET SIMULATION DOSSIER', 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Consolidated Multi-Round Allotment Progression & Cutoffs', 14, 25);

    // Right side badge for final summary
    doc.setFillColor(25, 135, 84); // KEA green
    doc.roundedRect(pageWidth - 14 - 38, 13, 38, 12, 1.5, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(255, 255, 255);
    doc.text('FINAL SUMMARY', pageWidth - 14 - 19, 21.2, { align: 'center' });

    let currentY = 46;

    // Candidate mini-profile
    doc.setFillColor(248, 250, 252); // Slate-50
    doc.setDrawColor(226, 232, 240); // Slate-200
    doc.roundedRect(14, currentY, pageWidth - 28, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    doc.text(`CANDIDATE: ${candidateInfo.name.toUpperCase()} (CET: ${candidateInfo.cetNo})`, 18, currentY + 8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`CET General Rank: `, 18, currentY + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 110, 253);
    doc.text(`${candidateInfo.rank}`, 46, currentY + 15);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Claimed Category: `, 115, currentY + 15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(candidateInfo.category, 142, currentY + 15);

    currentY += 32;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text('ALLOTMENT PROGRESSION OVER ALL COUNSELING ROUNDS', 14, currentY);
    currentY += 4;

    const tableHeaders = ['Round', 'Allotted Institution & Code', 'Branch', 'Quota', 'Choice No.', 'Cutoff Rank'];
    const tableBody = roundsData.map(item => {
        const alt = item.allotment;
        if (alt) {
            return [
                item.roundLabel,
                `${alt.collegeName} (${alt.collegeId})`,
                `${alt.branchName} (${alt.branchId})`,
                alt.allottedCategory || 'GM',
                alt.choiceNo?.toString() || '-',
                alt.cutoffRank ? alt.cutoffRank.toLocaleString() : '-'
            ];
        } else {
            return [
                item.roundLabel,
                'NO SEAT ALLOTTED',
                'N/A',
                'N/A',
                '-',
                '-'
            ];
        }
    });

    autoTable(doc, {
        startY: currentY,
        head: [tableHeaders],
        body: tableBody,
        theme: 'grid',
        headStyles: {
            fillColor: [25, 135, 84], // KEA Green
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 7.5,
            textColor: [51, 65, 85],
            cellPadding: 3.5
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 20, fontStyle: 'bold', textColor: [15, 23, 42] },
            1: { cellWidth: 65, fontStyle: 'bold' },
            2: { cellWidth: 45 },
            3: { halign: 'center', cellWidth: 15 },
            4: { halign: 'center', cellWidth: 15 },
            5: { halign: 'center', cellWidth: 22, fontStyle: 'bold', textColor: [25, 135, 84] }
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        margin: { left: 14, right: 14 },
        didDrawPage: (data) => {
            currentY = data.cursor?.y || currentY;
        }
    });

    currentY += 12;

    if (currentY > pageHeight - 35) {
        doc.addPage();
        currentY = 25;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('Note: This allotment history details your simulated seats across rounds. Cutoff ranks are sourced from official KEA statistical datasets.', 14, currentY);

    // Footer divider line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, pageHeight - 15, pageWidth - 14, pageHeight - 15);

    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Disclaimer: This is a simulation report generated for informational purposes. Official seat allotment is subject to actual KEA counseling procedures.', 14, pageHeight - 10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(25, 135, 84);
    doc.text('KEA SIMULATION INTELLIGENCE REPORT', 14, pageHeight - 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Page ${finalPageNum} of ${finalPageNum}`, pageWidth - 14, pageHeight - 6, { align: 'right' });

    doc.save(`KEA_All_Rounds_Allotment_${candidateInfo.cetNo}.pdf`);
};
