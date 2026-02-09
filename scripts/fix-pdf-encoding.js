const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'lib', 'invoicePdfGenerator.ts');

let content = fs.readFileSync(filePath, 'utf8');

// Remplacer tous les page.drawText avec sanitizeText
// Pattern: page.drawText('texte', { ... })
// ou: page.drawText(variable, { ... })

// Pour les chaînes littérales
content = content.replace(
  /page\.drawText\((['"`])(.+?)\1,/g,
  (match, quote, text) => {
    return `page.drawText(sanitizeText(${quote}${text}${quote}),`;
  }
);

// Pour les variables (sauf celles déjà sanitizées)
content = content.replace(
  /page\.drawText\((?!sanitizeText\()([a-zA-Z_$][a-zA-Z0-9_$]*(?:\s*as\s*string)?),/g,
  (match, varName) => {
    return `page.drawText(sanitizeText(${varName}),`;
  }
);

// Nettoyer les doubles sanitizeText
content = content.replace(/sanitizeText\(sanitizeText\(/g, 'sanitizeText(');

fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Encodage PDF corrigé - tous les textes sont maintenant sanitizés');
