import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { KEA_LOGO_BASE64, KARNATAKA_LOGO_BASE64 } from '../constants/logos';

export const exportChoiceEntryToPDF = (
    options: any[],
    candidateInfo: { name: string; cetNo: string; rank: string }
) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // --- 1. OFFICIAL KEA STYLE HEADER ---
    
    // Left Logo (KEA)
    try {
        doc.addImage(KEA_LOGO_BASE64, 'PNG', 14, 10, 24, 24);
    } catch (e) {
        console.warn("KEA Logo could not be loaded into PDF", e);
    }
    
    // Right Logo (Karnataka Emblem)
    try {
        doc.addImage(KARNATAKA_LOGO_BASE64, 'PNG', pageWidth - 38, 10, 24, 24);
    } catch (e) {
        console.warn("Karnataka Logo could not be loaded into PDF", e);
    }

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.text('KARNATAKA EXAMINATIONS AUTHORITY', pageWidth / 2, 18, { align: 'center' });
    doc.text('ADMISSION TO UGCET & OTHER PROFESSIONAL COURSES- 2026', pageWidth / 2, 25, { align: 'center' });
    doc.text('UGCET-2026 OPTIONS LIST', pageWidth / 2, 32, { align: 'center' });

    // Solid Line
    doc.setLineWidth(0.5);
    doc.line(14, 40, pageWidth - 14, 40);

    // --- 2. CANDIDATE DETAILS ROW ---
    let currentY = 45;
    doc.setLineWidth(0.3);
    // Draw outer box
    doc.rect(14, currentY, pageWidth - 28, 8, 'S');
    // Draw vertical middle line
    doc.line(pageWidth / 2, currentY, pageWidth / 2, currentY + 8);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`CET NO: ${candidateInfo.cetNo}`, (pageWidth / 4) + 7, currentY + 5.5, { align: 'center' });
    doc.text(`NAME: ${candidateInfo.name.toUpperCase()}`, (pageWidth * 0.75) - 7, currentY + 5.5, { align: 'center' });

    currentY += 12;

    // --- 3. OPTIONS TABLE ---
    const tableData = options.map(opt => [
        opt.priority.toString(),
        `${opt.collegeId}${opt.branchId}`,
        opt.branchName.toUpperCase(),
        (opt.fees || 'N/A').replace(/₹/g, 'Rs. '),
        opt.collegeName
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Optn.\nNo', 'College\nCourse', 'Course Name', 'Course Fee per Annum(Rs)', 'College Name']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center',
            valign: 'middle'
        },
        bodyStyles: {
            fontSize: 8,
            textColor: [0, 0, 0],
            lineColor: [0, 0, 0],
            lineWidth: 0.3,
            cellPadding: 2,
            valign: 'middle'
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { halign: 'center', cellWidth: 20 },
            2: { cellWidth: 45 },
            3: { cellWidth: 45 },
            4: { cellWidth: 'auto' }
        },
        didDrawPage: (data) => {
            // Add a discrete red disclaimer to avoid legal issues
            doc.setFontSize(6);
            doc.setTextColor(220, 0, 0);
            doc.text('NOT AN OFFICIAL DOCUMENT - SIMULATOR ONLY', 5, doc.internal.pageSize.height / 2, { angle: 90 });
        }
    });

    doc.save(`KEA_Options_List_${candidateInfo.cetNo}.pdf`);
};
