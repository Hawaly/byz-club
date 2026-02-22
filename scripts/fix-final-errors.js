/**
 * Script final pour supprimer toutes les props invalides restantes
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Suppression des props invalides restantes...\n');

const files = [
  'CodeMigration/client-portal/videos/page.tsx',
  'CodeMigration/client-portal/strategies/page.tsx'
];

for (const file of files) {
  const filePath = path.join(process.cwd(), file);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Supprimer iconColor
    content = content.replace(/\s+iconColor="[^"]+"/g, '');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
  }
}

console.log('\n✅ Terminé!');
