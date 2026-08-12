const fs = require('fs');
const path = require('path');

const pngPath = path.join(__dirname, '..', 'public', 'icons', 'logo-icon.png');
const pngBase64 = fs.readFileSync(pngPath).toString('base64');

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <image href="data:image/png;base64,${pngBase64}" x="0" y="0" width="512" height="512" />
</svg>`;

fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.svg'), svgContent);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'icons', 'icon.svg'), svgContent);
fs.writeFileSync(path.join(__dirname, '..', 'app', 'icon.svg'), svgContent);

console.log('SVG favicons written successfully');
