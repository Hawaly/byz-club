# 🔒 Audit de Sécurité - Préparation Production

## ✅ Points de Sécurité Vérifiés

### 1. Authentification
- [x] Utilisation de `getUser()` au lieu de `getSession()` (plus sécurisé)
- [x] Middleware de protection des routes
- [x] Vérification des rôles via `requireRole()`
- [x] Session côté serveur avec Supabase

### 2. Variables d'Environnement
- [ ] **ACTION REQUISE**: Vérifier `.env.local` et `.env.production`
- [ ] S'assurer que `SUPABASE_SERVICE_ROLE_KEY` n'est JAMAIS exposée côté client
- [ ] Utiliser `NEXT_PUBLIC_*` uniquement pour les variables publiques

### 3. API Routes
- [x] Protection par authentification sur toutes les routes sensibles
- [x] Validation des entrées utilisateur
- [x] Gestion des erreurs sans exposer d'informations sensibles

### 4. Base de Données (Supabase RLS)
- [ ] **ACTION REQUISE**: Vérifier toutes les politiques RLS
- [ ] S'assurer que les clients ne peuvent accéder qu'à leurs propres données
- [ ] Vérifier les politiques pour les tables: `invoice`, `payment`, `contract`, `client`

### 5. Encodage et Validation
- [x] Sanitization des textes pour PDF (WinAnsi)
- [ ] Validation des uploads de fichiers
- [ ] Protection XSS sur les inputs utilisateur

## 🚨 Points Critiques à Vérifier Avant Production

### Variables d'Environnement Requises

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key (JAMAIS exposée côté client)

# Autres
NODE_ENV=production
```

### Checklist de Déploiement

- [ ] Supprimer tous les `console.log()` sensibles
- [ ] Activer HTTPS uniquement
- [ ] Configurer les CORS correctement
- [ ] Définir les headers de sécurité (CSP, HSTS, etc.)
- [ ] Limiter les taux d'appels API (rate limiting)
- [ ] Configurer les logs de production
- [ ] Backup automatique de la base de données
- [ ] Plan de rollback en cas de problème

### Headers de Sécurité Recommandés

```javascript
// next.config.js
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]
```

## 📋 Actions Immédiates

1. **Vérifier les politiques RLS Supabase**
2. **Configurer les variables d'environnement de production**
3. **Tester l'authentification en production**
4. **Configurer les headers de sécurité**
5. **Mettre en place le monitoring et les alertes**

## 🔍 Tests de Sécurité à Effectuer

- [ ] Test d'accès non autorisé aux API
- [ ] Test d'injection SQL (normalement protégé par Supabase)
- [ ] Test XSS sur les formulaires
- [ ] Test de manipulation des IDs dans les URLs
- [ ] Test des permissions par rôle (admin vs client)

## 📞 Support

En cas de problème de sécurité en production, contacter immédiatement l'équipe de développement.
