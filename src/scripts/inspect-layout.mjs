import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import path from 'path';

async function inspect() {
    const dataBuffer = fs.readFileSync('../first round.pdf');
    const parser = new PDFParse({ data: dataBuffer });
    const textResult = await parser.getText();
    const text = textResult.text;
    const lines = text.split('\n');

    let count = 0;
    for (let i = 0; i < lines.length && count < 20; i++) {
        const line = lines[i].trim();
        if (line.includes('1G') && line.includes('GM')) {
            console.log('HEADER:', line);
        }
        if ((line.match(/(\d+|--)/g) || []).length > 10) {
            console.log('RANK LINE:', line);
            // Show 3 lines before it
            console.log('BEFORE:', lines.slice(i-3, i).join(' | '));
            count++;
        }
    }
}
inspect();
