import fs from 'fs';
import { PDFParse } from 'pdf-parse';
import path from 'path';

async function inspectAcharya() {
    const dataBuffer = fs.readFileSync('../first round.pdf');
    const parser = new PDFParse({ data: dataBuffer });
    const textResult = await parser.getText();
    const text = textResult.text;
    
    const start = text.indexOf('College: E079');
    const end = text.indexOf('College: E080') || text.indexOf('College: E081'); // Acharya is E079
    
    console.log('--- ACHARYA SECTION ---');
    console.log(text.substring(start, end !== -1 ? end : start + 5000));
}
inspectAcharya();
