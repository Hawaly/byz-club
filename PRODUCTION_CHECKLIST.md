# 🚀 Checklist de Déploiement Production

## ✅ Sécurité (CRITIQUE)

### Authentification & Autorisation
- [x] ✅ Utilisation de `getUser()` au lieu de `getSession()`
- [x] ✅ Middleware de protection des routes actif
- [x] ✅ Vérification des rôles via `requireRole()`
- [x] ✅ SUPABASE_SERVICE_ROLE_KEY non exposée côté client

### Headers de Sécurité
- [x] ✅ X-Frame-Options: SAMEORIGIN
- [x] ✅ X-Content-Type-Options: nosniff
- [x] ✅ X-XSS-Protection: 1; mode=block
- [x] ✅ Referrer-Policy: strict-origin-when-cross-origin
- [x] ✅ Permissions-Policy configuré
- [x] ✅ Strict-Transport-Security (HSTS)
- [x] ✅ Content-Security-Policy configuré

### Variables d'Environnement
- [ ] **ACTION REQUISE**: Configurer `.env.production` sur le serveur
- [ ] Vérifier que toutes les variables sont définies
- [ ] S'assurer que les secrets ne sont pas commités

```env
# Variables requises en production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NODE_ENV=production
```

## ⚠️ Vulnérabilités Détectées

### Dépendances à Mettre à Jour

1. **Next.js** (CRITIQUE - 1 vulnérabilité)
   - Vulnérabilités: DoS via Image Optimizer, Memory Consumption, HTTP deserialization
   - Action: Mettre à jour vers la dernière version stable
   ```bash
   npm install next@latest
   ```

2. **DOMPurify** (MODÉRÉ)
   - Vulnérabilité XSS dans dompurify < 3.2.4
   - Affecte: jspdf-invoice-template-nodejs
   - Action: Considérer une alternative ou attendre le fix

### Commandes de Correction

```bash
# Mettre à jour Next.js
npm install next@latest

# Vérifier les autres dépendances
npm audit fix

# Audit final
npm audit --production
```

## 🔒 Politiques RLS Supabase

### Tables à Vérifier

- [ ] **invoice** - Les clients ne voient que leurs factures
- [ ] **payment** - Les clients ne voient que leurs paiements
- [ ] **contract** - Les clients ne voient que leurs contrats
- [ ] **client** - Les clients ne voient que leurs propres données
- [ ] **app_user** - Vérifier les permissions par rôle

### Script de Test RLS

```bash
npx tsx scripts/test-rls-policies.ts
```

## 🎯 Optimisations Production

### Performance
- [x] ✅ Compression activée
- [x] ✅ removeConsole en production
- [x] ✅ Images optimisées (AVIF, WebP)
- [x] ✅ Split chunks configuré
- [x] ✅ Package imports optimisés (lucide-react, framer-motion)

### Build
- [x] ✅ Build réussi sans erreurs TypeScript
- [x] ✅ ESLint configuré (ignoré pendant build)
- [x] ✅ React Strict Mode activé

## 📊 Monitoring & Logs

### À Configurer sur le Serveur

- [ ] Monitoring des erreurs (ex: Sentry)
- [ ] Logs d'application centralisés
- [ ] Alertes pour erreurs critiques
- [ ] Monitoring des performances (ex: Vercel Analytics)
- [ ] Uptime monitoring

## 🔄 Backup & Recovery

- [ ] Backup automatique de la base Supabase
- [ ] Plan de rollback documenté
- [ ] Tests de restauration effectués
- [ ] Documentation des procédures d'urgence

## 🌐 Configuration Serveur

### DNS & Domaine
- [ ] Domaine configuré
- [ ] Certificat SSL/TLS actif
- [ ] Redirection HTTP → HTTPS
- [ ] WWW → non-WWW (ou inverse)

### CORS
- [ ] Origines autorisées configurées
- [ ] Headers CORS corrects pour Supabase

### Rate Limiting
- [ ] Limites d'API configurées
- [ ] Protection contre les attaques DDoS
- [ ] Throttling sur les endpoints sensibles

## 📝 Documentation

- [ ] README.md à jour
- [ ] Variables d'environnement documentées
- [ ] Guide de déploiement créé
- [ ] Procédures de maintenance documentées

## 🧪 Tests Avant Déploiement

### Tests Fonctionnels
- [ ] Authentification (login/logout)
- [ ] Création de factures
- [ ] Génération de PDF
- [ ] Paiements automatiques
- [ ] Accès par rôle (admin vs client)

### Tests de Sécurité
- [ ] Test d'accès non autorisé aux API
- [ ] Test de manipulation des IDs dans les URLs
- [ ] Test des permissions par rôle
- [ ] Test XSS sur les formulaires
- [ ] Test CSRF sur les actions sensibles

### Tests de Performance
- [ ] Temps de chargement < 3s
- [ ] Lighthouse score > 90
- [ ] Test de charge (100+ utilisateurs simultanés)

## 🚀 Déploiement

### Étapes de Déploiement

1. **Pré-déploiement**
   ```bash
   # Mettre à jour les dépendances
   npm install next@latest
   npm audit fix
   
   # Build de production
   npm run build
   
   # Tests de sécurité
   node scripts/security-check.js
   ```

2. **Migration Base de Données**
   ```bash
   # Appliquer les migrations Supabase
   supabase db push
   
   # Migrer les données
   npx tsx scripts/migrate-paid-invoices-to-payments.ts
   ```

3. **Déploiement**
   - Déployer sur Vercel/Netlify/autre
   - Configurer les variables d'environnement
   - Vérifier les logs de déploiement

4. **Post-déploiement**
   - Tester l'authentification
   - Vérifier les API endpoints
   - Tester la génération de PDF
   - Monitorer les logs pendant 24h

### Rollback en Cas de Problème

```bash
# Revenir à la version précédente
git revert HEAD
git push

# Ou utiliser le dashboard de votre hébergeur
# pour revenir au déploiement précédent
```

## 📞 Support & Contacts

- **Équipe Dev**: [email]
- **Supabase Support**: support@supabase.io
- **Hébergeur**: [support link]

## ✅ Validation Finale

Avant de marquer comme "Production Ready":

- [ ] Toutes les vulnérabilités critiques corrigées
- [ ] Tous les tests de sécurité passés
- [ ] Variables d'environnement configurées
- [ ] Backup configuré
- [ ] Monitoring actif
- [ ] Documentation complète
- [ ] Équipe formée sur les procédures

---

**Date de dernière mise à jour**: 2 février 2026
**Version**: 1.0.0
**Statut**: ⚠️ En préparation - Actions requises
