/**
 * Script pour ajouter le champ 'source' manquant dans src/app/client-portal/calendrier/mockData.ts
 */

const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/app/client-portal/calendrier/mockData.ts');

console.log('🔧 Ajout du champ source dans mockData.ts...\n');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Ajouter source: 'mock' avant chaque fermeture d'objet d'événement
  // Chercher les patterns: createdAt: ... suivi de }
  content = content.replace(/createdAt: new Date\([^)]+\)\n  \}/g, (match) => {
    return match.replace('}', ',\n    source: \'mock\' as const\n  }');
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Champ source ajouté à tous les événements mockés');
} else {
  console.log('❌ Fichier non trouvé');
}
