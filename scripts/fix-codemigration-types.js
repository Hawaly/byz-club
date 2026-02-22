/**
 * Script pour corriger les erreurs TypeScript dans CodeMigration
 * Supprime les props invalides (subtext, description, iconGradient)
 * et corrige les imports manquants
 */

const fs = require('fs');
const path = require('path');

const fixes = [
  // Mandats
  {
    file: 'CodeMigration/client-portal/mandats/page.tsx',
    replacements: [
      { from: /subtext=\{[^}]+\}\n\s*/g, to: '' },
      { from: /iconGradient=/g, to: 'gradient=' },
      { from: /<ModernCard className=/g, to: '<ModernCard title="" className=' },
      { from: /import \{ ([^}]+) \} from 'lucide-react';/g, to: "import { $1, ListTodo, Activity, CheckCheck } from 'lucide-react';" }
    ]
  },
  // Videos
  {
    file: 'CodeMigration/client-portal/videos/page.tsx',
    replacements: [
      { from: /subtext="[^"]+"\n\s*/g, to: '' },
      { from: /description="[^"]+"\n\s*/g, to: '' },
      { from: /iconGradient=/g, to: 'gradient=' }
    ]
  },
  // Strategies
  {
    file: 'CodeMigration/client-portal/strategies/page.tsx',
    replacements: [
      { from: /description="[^"]+"\n\s*/g, to: '' },
      { from: /iconGradient=/g, to: 'gradient=' }
    ]
  }
];

console.log('🔧 Correction des erreurs TypeScript dans CodeMigration...\n');

let fixedCount = 0;
let errorCount = 0;

for (const fix of fixes) {
  const filePath = path.join(process.cwd(), fix.file);
  
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Fichier non trouvé: ${fix.file}`);
      continue;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    for (const replacement of fix.replacements) {
      const before = content;
      content = content.replace(replacement.from, replacement.to);
      if (content !== before) {
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ ${fix.file}`);
      fixedCount++;
    } else {
      console.log(`⏭️  ${fix.file} (déjà corrigé)`);
    }
  } catch (error) {
    console.error(`❌ Erreur sur ${fix.file}:`, error.message);
    errorCount++;
  }
}

console.log('\n' + '='.repeat(50));
console.log(`✅ Fichiers corrigés: ${fixedCount}`);
console.log(`❌ Erreurs: ${errorCount}`);
console.log('='.repeat(50));
