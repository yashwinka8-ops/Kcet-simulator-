const https = require('https');
const fs = require('fs');
const path = require('path');

const downloadAsBase64 = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                return resolve(downloadAsBase64(res.headers.location));
            }
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const ext = path.extname(url).slice(1) || 'png';
                const type = ext === 'svg' ? 'svg+xml' : ext;
                resolve(`data:image/${type};base64,${buffer.toString('base64')}`);
            });
        }).on('error', reject);
    });
};

const run = async () => {
    try {
        const keaUrl = 'https://www.crustindia.com/wp-content/uploads/2019/06/KEA-Logo.png';
        const karnatakaUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr_XSIiUiIRG6h-urBHXDM47wrjw6rRVQkgw&s';
        
        console.log('Downloading KEA logo...');
        const keaBase64 = await downloadAsBase64(keaUrl);
        console.log('Downloading Karnataka logo...');
        const karBase64 = await downloadAsBase64(karnatakaUrl);
        
        const dir = path.join(__dirname, 'src/lib/constants');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        
        const tsContent = `export const KEA_LOGO_BASE64 = "${keaBase64}";\nexport const KARNATAKA_LOGO_BASE64 = "${karBase64}";\n`;
        fs.writeFileSync(path.join(dir, 'logos.ts'), tsContent);
        console.log('Successfully created logos.ts');
    } catch(err) {
        console.error(err);
    }
};

run();
