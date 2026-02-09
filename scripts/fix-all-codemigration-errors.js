/**
 * Script pour corriger TOUTES les erreurs TypeScript dans CodeMigration
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Correction complète des erreurs TypeScript dans CodeMigration...\n');

// 1. Supprimer tous les subtext dans videos/page.tsx
const videosPath = path.join(process.cwd(), 'CodeMigration/client-portal/videos/page.tsx');
if (fs.existsSync(videosPath)) {
  let content = fs.readFileSync(videosPath, 'utf8');
  content = content.replace(/\s+subtext="[^"]+"/g, '');
  content = content.replace(/\s+subtext=\{[^}]+\}/g, '');
  content = content.replace(/gradient="from-orange-500 to-orange-600"/g, 'iconColor="text-orange-500"');
  fs.writeFileSync(videosPath, content, 'utf8');
  console.log('✅ videos/page.tsx - subtext supprimés');
}

// 2. Supprimer gradient dans EmptyState et corriger props invalides dans strategies/page.tsx
const strategiesPath = path.join(process.cwd(), 'CodeMigration/client-portal/strategies/page.tsx');
if (fs.existsSync(strategiesPath)) {
  let content = fs.readFileSync(strategiesPath, 'utf8');
  
  // Supprimer gradient dans EmptyState
  content = content.replace(/gradient="from-orange-500 to-orange-600"/g, 'iconColor="text-orange-500"');
  
  // Supprimer stats prop
  content = content.replace(/\s+stats=\{[^\]]+\]\}/gs, '');
  
  // Supprimer hover prop
  content = content.replace(/\s+hover=\{[^}]+\}/g, '');
  
  // Ajouter title="" aux ModernCard sans title
  content = content.replace(/<ModernCard className=/g, '<ModernCard title="" className=');
  content = content.replace(/<ModernCard>/g, '<ModernCard title="">');
  
  fs.writeFileSync(strategiesPath, content, 'utf8');
  console.log('✅ strategies/page.tsx - props invalides supprimées');
}

// 3. Corriger factures/page.tsx - ajouter title aux ModernCard
const facturesPath = path.join(process.cwd(), 'CodeMigration/client-portal/factures/page.tsx');
if (fs.existsSync(facturesPath)) {
  let content = fs.readFileSync(facturesPath, 'utf8');
  
  // Remplacer tous les ModernCard sans title
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<ModernCard') && !line.includes('title=')) {
      newLines.push(line.replace('<ModernCard', '<ModernCard title=""'));
    } else {
      newLines.push(line);
    }
  }
  
  content = newLines.join('\n');
  fs.writeFileSync(facturesPath, content, 'utf8');
  console.log('✅ factures/page.tsx - title ajouté aux ModernCard');
}

// 4. Corriger mandats/page.tsx - ajouter title aux ModernCard
const mandatsPath = path.join(process.cwd(), 'CodeMigration/client-portal/mandats/page.tsx');
if (fs.existsSync(mandatsPath)) {
  let content = fs.readFileSync(mandatsPath, 'utf8');
  
  const lines = content.split('\n');
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('<ModernCard') && !line.includes('title=')) {
      newLines.push(line.replace('<ModernCard', '<ModernCard title=""'));
    } else {
      newLines.push(line);
    }
  }
  
  content = newLines.join('\n');
  fs.writeFileSync(mandatsPath, content, 'utf8');
  console.log('✅ mandats/page.tsx - title ajouté aux ModernCard');
}

console.log('\n' + '='.repeat(50));
console.log('✅ Corrections terminées!');
console.log('='.repeat(50));
