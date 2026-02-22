# 🚀 Guide complet de résolution - Erreur RLS "client"

## ❌ Erreur actuelle
```
new row violates row-level security policy for table "client"
```

## 🔍 Diagnostic

Cette erreur signifie que **votre utilisateur connecté n'a pas les permissions RLS** pour créer un client.

### Causes possibles
1. ✅ Les migrations ne sont **PAS encore appliquées** dans Supabase
2. ✅ Votre utilisateur a le rôle `client` au lieu de `staff` ou `admin`
3. ✅ La session n'est pas correctement propagée (rare)

---

## 📋 ÉTAPE 1 : Vérifier l'état actuel

### A. Exécutez le script de diagnostic

Dans **Supabase Dashboard → SQL Editor**, copiez-collez et exécutez :

```sql
-- Script DEBUG_check_rls_and_user.sql
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  cmd
FROM pg_policies
WHERE tablename = 'client'
ORDER BY policyname;
```

**Résultats attendus :**
- `admin_all_client` (FOR ALL)
- `staff_all_client` (FOR ALL) ← **DOIT EXISTER**
- `client_view_own_client` (FOR SELECT)

**Si `staff_all_client` n'existe PAS** → Les migrations ne sont pas appliquées

### B. Vérifiez votre rôle utilisateur

```sql
SELECT 
  au.email,
  r.code as role_code,
  r.name as role_name,
  au.is_active
FROM public.app_user au
JOIN public.role r ON r.id = au.role_id
WHERE au.auth_user_id = auth.uid();
```

**Résultat attendu :**
- `role_code` = `'admin'` ou `'staff'` (PAS `'client'`)

**Si role_code = 'client'** → Vous devez changer le rôle

---

## 📋 ÉTAPE 2 : Appliquer les migrations (SI NÉCESSAIRE)

Si `staff_all_client` n'existe pas, exécutez les migrations **dans cet ordre** :

### Migration 1 : Fixer le schéma app_user
```sql
-- Exécutez migrations/002_fix_app_user_schema_v2.sql
-- (Copier-coller tout le fichier dans SQL Editor)
```

### Migration 2 : Créer le trigger auth
```sql
-- Exécutez migrations/001_add_auth_user_trigger.sql
```

### Migration 3 : Corriger les fonctions
```sql
-- Exécutez migrations/003_fix_functions_and_views.sql
```

### Migration 4 : Ajouter les politiques RLS staff ⭐
```sql
-- Exécutez migrations/004_add_staff_rls_policies.sql
-- CETTE MIGRATION EST CRUCIALE POUR VOTRE PROBLÈME
```

---

## 📋 ÉTAPE 3 : Corriger votre rôle utilisateur (SI NÉCESSAIRE)

Si votre `role_code` n'est pas `admin` ou `staff` :

```sql
-- Mettre votre utilisateur en STAFF
UPDATE public.app_user 
SET role_id = 3  -- 3 = staff, 1 = admin
WHERE email = 'VOTRE_EMAIL@EXEMPLE.COM';

-- OU mettre en ADMIN (permissions complètes)
UPDATE public.app_user 
SET role_id = 1
WHERE email = 'VOTRE_EMAIL@EXEMPLE.COM';
```

---

## 📋 ÉTAPE 4 : Déconnexion / Reconnexion

**IMPORTANT :** Après avoir changé le rôle, vous devez :

1. Vous déconnecter de l'application
2. Vous reconnecter
3. La nouvelle session aura le bon rôle

---

## 📋 ÉTAPE 5 : Tester

1. Allez sur `/clients/new`
2. Remplissez le formulaire
3. Cliquez sur "Créer"

**Résultat attendu :** ✅ Client créé avec succès

---

## 🔧 Vérification finale

Après tout ce processus, exécutez ces requêtes pour confirmer :

```sql
-- 1. Vérifier les policies
SELECT policyname FROM pg_policies WHERE tablename = 'client';

-- 2. Vérifier votre rôle
SELECT r.code FROM app_user au 
JOIN role r ON r.id = au.role_id 
WHERE au.auth_user_id = auth.uid();

-- 3. Tester is_staff()
SELECT public.is_staff() as je_suis_staff;
```

**Résultats attendus :**
1. `staff_all_client` dans la liste
2. `code` = `'staff'` ou `'admin'`
3. `je_suis_staff` = `true` (si staff) ou `false` (si admin, c'est normal)

---

## 🎯 Résumé rapide

1. Exécutez les 4 migrations SQL dans Supabase
2. Vérifiez que votre user a `role_id = 1` (admin) ou `3` (staff)
3. Déconnectez-vous et reconnectez-vous
4. Testez la création de client

**C'est tout !** 🚀
