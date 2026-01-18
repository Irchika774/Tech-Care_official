
const fs = require('fs');
const path = 'public/lithosquare.html';

let content = fs.readFileSync(path, 'utf8');

// Replace CSS path
content = content.replace(/https:\/\/cdn\.prod\.website-files\.com\/683fe9ed9abe575daebf23d8\/css\/lithosquare-preprod\.webflow\.shared\.8753e7e58\.min\.css/g, '/lithosquare/css/lithosquare-preprod.webflow.shared.8753e7e58.min.css');

// Replace JS paths
content = content.replace(/https:\/\/cdn\.prod\.website-files\.com\/683fe9ed9abe575daebf23d8\/js\//g, '/lithosquare/js/');

// Replace Image/Font paths (generic replacement for the folder)
content = content.replace(/https:\/\/cdn\.prod\.website-files\.com\/683fe9ed9abe575daebf23d8\//g, '/lithosquare/images/');

// Fix fonts
content = content.replace(/\/lithosquare\/images\/([^\/]+\.woff2)/g, '/lithosquare/fonts/$1');

// Replace Video paths
content = content.replace(/https:\/\/assets\.mprez\.fr\/lithosquare\//g, '/lithosquare/videos/');

fs.writeFileSync(path, content);
console.log("Paths updated successfully.");
