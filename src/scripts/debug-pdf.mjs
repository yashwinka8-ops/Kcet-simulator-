import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import path from 'path';

async function debugPdf(fileName) {
    const dataBuffer = fs.readFileSync(fileName);
    const parser = new PDFParse({ data: dataBuffer });
    const textResult = await parser.getText();
    const text = textResult.text;
    const lines = text.split('\n');
    console.log(`--- ${fileName} ---`);
    const acharyaIndex = text.indexOf('Acharya Institute of Technology');
    if (acharyaIndex !== -1) {
        console.log('ACHARYA FOUND:');
        console.log(text.substring(acharyaIndex, acharyaIndex + 2000));
    }


    console.log('SAMPLE DATA:');
    console.log(text.substring(0, 5000));
}



const files = [
    '../first round.pdf',
    '../kcet-round-2-provisional-cutoff.pdf',
    '../round 3.pdf'
];


for (const file of files) {
    const fullPath = path.resolve(file);
    if (fs.existsSync(fullPath)) {
        await debugPdf(fullPath);
    } else {
        console.log(`File not found: ${fullPath}`);
    }
}
