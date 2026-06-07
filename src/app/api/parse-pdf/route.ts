import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const data = await pdfParse(buffer);
        const text = data.text;

        // Simple Regex extraction based on standard KCET result formats
        let name = '';
        let cetNo = '';
        let rank = '';

        // Extract Application Number (e.g., "Application Number\n26181693")
        const cetMatch = text.match(/Application Number\s*\n\s*([A-Z0-9]+)/i) || text.match(/CET\s*(?:No\.?|Number)\s*[:\-]?\s*([A-Z0-9]{6,8})/i);
        if (cetMatch) cetNo = cetMatch[1].trim();

        // Extract Name (e.g., "Name\nYashwin K A")
        const nameMatch = text.match(/Name\s*\n\s*([^\n]+)/i) || text.match(/(?:Candidate'?s?\s*Name)\s*[:\-]?\s*([A-Za-z\s\.]+)/i);
        if (nameMatch) name = nameMatch[1].trim();

        // Extract Rank (e.g., "Engineering8892.00000000" or "Engineering 8892")
        const rankMatch = text.match(/Engineering\s*([0-9]+)/i);
        if (rankMatch) {
            rank = rankMatch[1].trim();
        }

        return NextResponse.json({ 
            success: true, 
            extracted: { name, cetNo, rank }
        });
    } catch (error) {
        console.error("PDF Parsing error:", error);
        return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }
}
