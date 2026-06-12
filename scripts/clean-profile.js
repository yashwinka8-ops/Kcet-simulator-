const fs = require('fs');
const buf = fs.readFileSync('src/app/[[...slug]]/pages/ProfilePage.tsx');
const cleaned = buf.toString('utf8').replace(/\uFFFD/g, ''); // Remove replacement characters or just let Node decode it cleanly.
// Wait, if it's invalid UTF-8, node's toString('utf8') might just replace it with .
// Let's rewrite it.
fs.writeFileSync('src/app/[[...slug]]/pages/ProfilePage.tsx', cleaned, 'utf8');
console.log('Cleaned file');
