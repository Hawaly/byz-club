/**
 * Script d'audit de sécurité automatique
 * Vérifie les points critiques avant le déploiement en production
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 AUDIT DE SÉCURITÉ - Vérification des points critiques\n');
console.log('='.repeat(60));

let errors = [];
let warnings = [];
let passed = [];

// 1. Vérifier que SUPABASE_SERVICE_ROLE_KEY n'est pas exposée côté client
console.log('\n📋 1. Vérification des clés secrètes...');
const srcFiles = getAllFiles('./src', ['.ts', '.tsx', '.js', '.jsx']);
let serviceRoleExposed = false;

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('SUPABASE_SERVICE_ROLE_KEY') && !file.includes('api')) {
    errors.push(`❌ SUPABASE_SERVICE_ROLE_KEY trouvée dans ${file} (côté client)`);
    serviceRoleExposed = true;
  }
});

if (!serviceRoleExposed) {
  passed.push('✅ SUPABASE_SERVICE_ROLE_KEY non exposée côté client');
}

// 2. Vérifier l'utilisation de getUser() au lieu de getSession()
console.log('\n📋 2. Vérification de l\'authentification sécurisée...');
let unsafeAuth = false;

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('getSession()') && !content.includes('// @ts-nocheck')) {
    warnings.push(`⚠️  getSession() trouvée dans ${file} (utiliser getUser() à la place)`);
    unsafeAuth = true;
  }
});

if (!unsafeAuth) {
  passed.push('✅ Utilisation correcte de getUser() pour l\'authentification');
}

// 3. Vérifier les console.log sensibles
console.log('\n📋 3. Vérification des console.log...');
let sensitiveLogsFound = false;

srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    if (line.includes('console.log') && 
        (line.toLowerCase().includes('password') || 
         line.toLowerCase().includes('token') || 
         line.toLowerCase().includes('secret') ||
         line.toLowerCase().includes('key'))) {
      warnings.push(`⚠️  Console.log sensible ligne ${index + 1} dans ${file}`);
      sensitiveLogsFound = true;
    }
  });
});

if (!sensitiveLogsFound) {
  passed.push('✅ Pas de console.log sensibles détectés');
}

// 4. Vérifier les fichiers .env
console.log('\n📋 4. Vérification des fichiers d\'environnement...');
if (fs.existsSync('.env.local')) {
  passed.push('✅ .env.local existe');
} else {
  warnings.push('⚠️  .env.local non trouvé');
}

if (fs.existsSync('.env.example')) {
  passed.push('✅ .env.example existe pour documentation');
} else {
  warnings.push('⚠️  .env.example non trouvé (recommandé pour documentation)');
}

// 5. Vérifier .gitignore
console.log('\n📋 5. Vérification du .gitignore...');
if (fs.existsSync('.gitignore')) {
  const gitignore = fs.readFileSync('.gitignore', 'utf8');
  if (gitignore.includes('.env.local') || gitignore.includes('.env*.local')) {
    passed.push('✅ .env.local est dans .gitignore');
  } else {
    errors.push('❌ .env.local doit être dans .gitignore');
  }
} else {
  errors.push('❌ .gitignore manquant');
}

// 6. Vérifier next.config.js pour les headers de sécurité
console.log('\n📋 6. Vérification des headers de sécurité...');
if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) {
  const configFile = fs.existsSync('next.config.js') ? 'next.config.js' : 'next.config.mjs';
  const config = fs.readFileSync(configFile, 'utf8');
  
  if (config.includes('X-Frame-Options') || config.includes('headers')) {
    passed.push('✅ Headers de sécurité configurés');
  } else {
    warnings.push('⚠️  Headers de sécurité non configurés dans next.config');
  }
} else {
  warnings.push('⚠️  next.config.js non trouvé');
}

// 7. Vérifier les dépendances vulnérables
console.log('\n📋 7. Vérification des dépendances...');
warnings.push('⚠️  Exécuter "npm audit" pour vérifier les vulnérabilités');

// Résumé
console.log('\n' + '='.repeat(60));
console.log('📊 RÉSUMÉ DE L\'AUDIT\n');

if (passed.length > 0) {
  console.log('✅ TESTS RÉUSSIS:');
  passed.forEach(p => console.log('   ' + p));
}

if (warnings.length > 0) {
  console.log('\n⚠️  AVERTISSEMENTS:');
  warnings.forEach(w => console.log('   ' + w));
}

if (errors.length > 0) {
  console.log('\n❌ ERREURS CRITIQUES:');
  errors.forEach(e => console.log('   ' + e));
}

console.log('\n' + '='.repeat(60));

if (errors.length > 0) {
  console.log('\n🚨 ATTENTION: Des erreurs critiques ont été détectées!');
  console.log('   Corrigez-les avant de déployer en production.\n');
  process.exit(1);
} else if (warnings.length > 0) {
  console.log('\n⚠️  Des avertissements ont été détectés.');
  console.log('   Vérifiez-les avant le déploiement.\n');
  process.exit(0);
} else {
  console.log('\n✅ Tous les tests de sécurité sont passés!\n');
  process.exit(0);
}

// Helper function
function getAllFiles(dirPath, extensions, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next')) {
        arrayOfFiles = getAllFiles(filePath, extensions, arrayOfFiles);
      }
    } else {
      if (extensions.some(ext => file.endsWith(ext))) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}
