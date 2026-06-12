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
