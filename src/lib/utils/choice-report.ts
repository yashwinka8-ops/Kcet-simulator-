import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportChoiceEntryToPDF = (
    options: any[],
    candidateInfo: { name: string; cetNo: string; rank: string }
) => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.width;

    // --- 1. OFFICIAL KEA STYLE HEADER ---
    doc.setFillColor(0, 82, 155); // KEA Blue #00529B
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add Logo (Using the official URL)
    try {
        doc.addImage('https://www.crustindia.com/wp-content/uploads/2019/06/KEA-Logo.png', 'PNG', 14, 8, 24, 24);
    } catch (e) {
        console.warn("Logo could not be loaded into PDF", e);
    }

    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('KARNATAKA EXAMINATIONS AUTHORITY', pageWidth / 2 + 10, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('CET-2025 :: OPTION ENTRY CHOICE REPORT', pageWidth / 2, 25, { align: 'center' });
    doc.text('MOCK ROUND SEAT ALLOTMENT SYSTEM', pageWidth / 2, 32, { align: 'center' });

    // --- 2. CANDIDATE DETAILS ---
    let currentY = 55;
    doc.setFillColor(245, 245, 245);
    doc.rect(14, currentY - 5, pageWidth - 28, 25, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(14, currentY - 5, pageWidth - 28, 25, 'S');

    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.setFont('helvetica', 'bold');
    doc.text('CANDIDATE NAME:', 20, currentY + 3);
    doc.setFont('helvetica', 'normal');
    doc.text(candidateInfo.name.toUpperCase(), 55, currentY + 3);

    doc.setFont('helvetica', 'bold');
    doc.text('CET NUMBER:', 20, currentY + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(candidateInfo.cetNo, 55, currentY + 12);

    doc.setFont('helvetica', 'bold');
    doc.text('GEN RANK:', 120, currentY + 12);
    doc.setFont('helvetica', 'normal');
    doc.text(candidateInfo.rank, 150, currentY + 12);

    currentY += 35;

    // --- 3. OPTIONS TABLE ---
    const tableData = options.map(opt => [
        opt.priority.toString(),
        opt.collegeId,
        opt.collegeName.toUpperCase(),
        opt.branchId,
        opt.branchName.toUpperCase()
    ]);

    autoTable(doc, {
        startY: currentY,
        head: [['Priority', 'Code', 'College Name', 'Course', 'Course Name']],
        body: tableData,
        theme: 'grid',
        headStyles: { 
            fillColor: [0, 82, 155], 
            textColor: [255, 255, 255], 
            fontSize: 8, 
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: { 
            fontSize: 7, 
            textColor: [33, 33, 33],
            cellPadding: 3
        },
        columnStyles: {
            0: { halign: 'center', fontStyle: 'bold', cellWidth: 15 },
            1: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
            2: { cellWidth: 85 },
            3: { halign: 'center', fontStyle: 'bold', cellWidth: 20 },
            4: { cellWidth: 50 }
        },
        didDrawPage: (data) => {
            // Footer
            doc.setFontSize(7);
            doc.setTextColor(150, 150, 150);
            doc.text(`Generated on: ${timestamp}`, 14, doc.internal.pageSize.height - 10);
            doc.text(`Page ${data.pageNumber}`, pageWidth - 20, doc.internal.pageSize.height - 10);
        }
    });

    // --- 4. SIGNATURE AREA ---
    const finalY = (doc as any).lastAutoTable.finalY + 30;
    if (finalY < doc.internal.pageSize.height - 40) {
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.text('I hereby declare that the options entered by me are correct to the best of my knowledge.', 14, finalY);
        doc.line(14, finalY + 20, 70, finalY + 20);
        doc.text('Candidate Signature', 14, finalY + 25);
        
        doc.line(pageWidth - 70, finalY + 20, pageWidth - 14, finalY + 20);
        doc.text('KEA Authority Signature', pageWidth - 70, finalY + 25);
    }

    doc.save(`KEA_Choice_Report_${candidateInfo.cetNo}.pdf`);
};
