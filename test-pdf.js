const fs = require('fs');
const pdfParse = require('pdf-parse');

async function testParse() {
    const buffer = fs.readFileSync('Check Result - Karnataka Examinations Authority.pdf');
    const data = await pdfParse(buffer);
    const text = data.text;
    console.log("Raw text:", text.substring(0, 1000));
    
    let name = '';
    let cetNo = '';
    let rank = '';

    const cetMatch = text.match(/CET\s*(?:No\.?|Number)\s*[:\-]?\s*([A-Z0-9]{6,8})/i) || text.match(/([0-9]{2}[A-Z]{3,5}[0-9]?)/i);
    if (cetMatch) cetNo = cetMatch[1].trim();

    const nameMatch = text.match(/(?:Candidate'?s?\s*Name|Name(?:\s*of\s*the\s*Candidate)?)\s*[:\-]?\s*([A-Za-z\s\.]+)/i);
    if (nameMatch) name = nameMatch[1].trim();

    const rankMatch = text.match(/Engineering[\s\S]{0,100}?([0-9]+)/i);
    if (rankMatch) rank = rankMatch[1].trim();

    console.log("\nExtracted:", { name, cetNo, rank });
}

testParse();
