# 🚀 Guide d'activation du module Paiements

## Problème actuel
La page `/paiements` est vide car la table `payment` n'existe pas encore dans votre base de données.

## ✅ Solution en 3 étapes

### Étape 1 : Appliquer la migration SQL

**Option A - Via Supabase Dashboard (Recommandé)**
1. Ouvrez [Supabase Dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Créez une nouvelle requête
5. Copiez-collez le contenu du fichier :
   ```
   supabase/migrations/20250127_billing_refactor_contracts.sql
   ```
6. Cliquez sur **Run** pour exécuter

**Option B - Via CLI Supabase**
```bash
supabase db push
```

### Étape 2 : Migrer les factures payées existantes

Après avoir appliqué la migration, exécutez ce script pour créer automatiquement des paiements pour toutes vos factures déjà payées :

```bash
npx tsx scripts/migrate-paid-invoices-to-payments.ts
```

Ce script va :
- ✅ Trouver toutes les factures avec `status = 'payee'`
- ✅ Créer un enregistrement de paiement pour chacune
- ✅ Utiliser la date de paiement de la facture
- ✅ Montant = total TTC de la facture

### Étape 3 : Vérifier

1. Rafraîchissez la page `/paiements`
2. Vous devriez voir tous vos paiements historiques
3. Les nouveaux paiements seront créés automatiquement quand vous marquez une facture comme payée

---

## 🎯 Fonctionnement après activation

### Création automatique de paiements

Quand vous marquez une facture comme "Payée" :
1. ✅ Un paiement est créé automatiquement
2. ✅ Visible immédiatement dans `/paiements`
3. ✅ Badge "🤖 Auto" pour identifier les paiements automatiques
4. ✅ Le KPI "Collected Revenue" est mis à jour

### Création manuelle de paiements

Vous pouvez aussi créer des paiements manuellement via :
- Le bouton "Enregistrer un Paiement" sur `/paiements`
- L'API `POST /api/payments`

---

## 📊 Tables créées par la migration

La migration crée 3 nouvelles tables :

1. **`client_contract`** - Contrats virtuels (Expected Revenue)
2. **`contract_schedule`** - Échéances de facturation planifiées
3. **`payment`** - Paiements reçus (Collected Revenue)

---

## 🔍 Vérification rapide

Pour vérifier que tout fonctionne :

```sql
-- Dans Supabase SQL Editor
SELECT COUNT(*) FROM payment;
SELECT COUNT(*) FROM client_contract;
SELECT COUNT(*) FROM contract_schedule;
```

Si ces requêtes fonctionnent, la migration est réussie ! ✅

---

## 🆘 En cas de problème

### Erreur "role_id does not exist"
✅ **Déjà corrigé** - Les politiques RLS utilisent maintenant `app_user.role_id`

### Erreur "foreign key constraint"
✅ **Déjà corrigé** - Les types UUID sont cohérents avec `auth.users`

### La page reste vide après migration
1. Vérifiez que la migration s'est bien exécutée (pas d'erreurs)
2. Exécutez le script de migration des factures payées
3. Rafraîchissez la page (Ctrl+F5)
4. Vérifiez la console du navigateur pour les erreurs

---

## 📞 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs Supabase (Dashboard > Logs)
2. La console du navigateur (F12)
3. Les logs du serveur Next.js

**Fichiers importants :**
- Migration SQL : `supabase/migrations/20250127_billing_refactor_contracts.sql`
- Script migration : `scripts/migrate-paid-invoices-to-payments.ts`
- API Paiements : `src/app/api/payments/route.ts`
- Page Paiements : `src/app/(dashboard)/paiements/page.tsx`
