import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { GroupedResult, PredictorInput } from '@/lib/types';

export const exportPredictorToPDF = (
    results: { safe: GroupedResult[]; moderate: GroupedResult[]; dream: GroupedResult[] },
    input: PredictorInput
) => {
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.width;

    // --- 1. PREMIUM HEADER ---
    // Background header bar
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Add Logo
    try {
        doc.addImage('https://www.crustindia.com/wp-content/uploads/2019/06/KEA-Logo.png', 'PNG', 14, 8, 20, 20);
    } catch (e) {
        console.warn("Logo load failed", e);
    }

    // Title
    doc.setFontSize(22);
    doc.setTextColor(225, 29, 72); // Rose-500
    doc.setFont('helvetica', 'bold');
    doc.text('KCET INTELLIGENCE', 38, 22);
    
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('helvetica', 'normal');
    doc.text('PREDICTOR REPORT 2026', 39, 29);

    // Generation Info (Top Right)
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${timestamp}`, pageWidth - 14, 25, { align: 'right' });
    doc.text(`ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, pageWidth - 14, 30, { align: 'right' });

    // --- 2. CANDIDATE PROFILE SUMMARY ---
    let currentY = 60;
    
    // Profile Box
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, currentY - 5, pageWidth - 28, 25, 3, 3, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, currentY - 5, pageWidth - 28, 25, 3, 3, 'S');

    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('CANDIDATE PROFILE', 20, currentY + 3);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    
    // Grid-like layout for info
    doc.text(`Rank:`, 20, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(225, 29, 72);
    doc.text(`${input.rank}`, 32, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Category:`, 65, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`${input.category}`, 82, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Counseling:`, 115, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Round ${input.round}`, 135, currentY + 12);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Region:`, 165, currentY + 12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(input.regions.length > 0 ? input.regions[0] : 'All', 180, currentY + 12);

    currentY += 35;

    // --- 3. SECTION RENDERING ---
    const renderSection = (title: string, data: GroupedResult[], mainColor: [number, number, number], lightColor: [number, number, number]) => {
        if (data.length === 0) return;

        // Section Title with Badge Effect
        doc.setFillColor(lightColor[0], lightColor[1], lightColor[2]);
        doc.roundedRect(14, currentY - 6, 80, 10, 2, 2, 'F');
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(mainColor[0], mainColor[1], mainColor[2]);
        doc.text(title, 18, currentY);
        
        currentY += 10;

        const tableData: any[] = [];
        data.forEach(group => {
            group.branches.forEach((branch, idx) => {
                tableData.push([
                    idx === 0 ? group.college.full_name : '', // Show college name once
                    branch.branch.branch_name,
                    branch.closing_rank.toLocaleString(),
                    `${branch.probability}%`
                ]);
            });
        });

        autoTable(doc, {
            startY: currentY,
            head: [['College Name', 'Specialization / Branch', 'Closing Rank', 'Admission Probability']],
            body: tableData,
            theme: 'grid',
            headStyles: { 
                fillColor: mainColor, 
                textColor: [255, 255, 255], 
                fontSize: 9, 
                fontStyle: 'bold',
                halign: 'center'
            },
            bodyStyles: { 
                fontSize: 8, 
                textColor: [51, 65, 85],
                cellPadding: 4
            },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 85, textColor: [15, 23, 42] }, // BOLD COLLEGE NAME
                1: { cellWidth: 55 },
                2: { halign: 'center', fontStyle: 'bold' },
                3: { halign: 'center', fontStyle: 'bold' }
            },
            alternateRowStyles: {
                fillColor: [250, 251, 253]
            },
            margin: { left: 14, right: 14 },
            didDrawPage: (data) => {
                currentY = data.cursor?.y || currentY;
            }
        });

        currentY += 20;
        
        // Page break logic
        if (currentY > 250) {
            doc.addPage();
            currentY = 20;
        }
    };

    // Colors: [Main, Light]
    renderSection('SAFE CHANCES', results.safe, [5, 150, 105], [209, 250, 229]); // Emerald
    renderSection('MODERATE CHANCES', results.moderate, [217, 119, 6], [254, 243, 199]); // Amber
    renderSection('DREAM OPTIONS', results.dream, [225, 29, 72], [255, 228, 230]); // Rose

    // --- 4. FOOTER & PAGINATION ---
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        
        // Footer Line
        doc.setDrawColor(241, 245, 249);
        doc.line(14, 280, pageWidth - 14, 280);

        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        doc.text('Disclaimer: This prediction is based on previous year trends and AI-modeling. Official seat allotment is subject to KEA guidelines.', 14, 285);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, 285, { align: 'right' });
        
        // Brand tag
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(225, 29, 72);
        doc.text('KCET PREDICTOR PLATFORM', 14, 290);
    }

    // --- 5. SAVE ---
    doc.save(`KCET_Admission_Report_${input.rank}.pdf`);
};
