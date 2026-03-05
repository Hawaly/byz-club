# Guide du Workflow de Concepts Créatifs

**Date** : 27 février 2026  
**Version** : 1.0

---

## 🎯 Vue d'Ensemble

Le système de concepts créatifs permet à l'équipe de proposer des idées de contenus (Reels ou Posts) aux clients et d'obtenir leur validation avant production.

---

## 📋 Workflow Complet

### **1. Création d'un Concept (Admin)**

**Qui** : Équipe créative / Admin  
**Où** : Dashboard Admin → `/concepts`

#### Étapes :
1. Cliquez sur **"Nouveau Concept"**
2. Sélectionnez le **type** :
   - 🎬 **Reel** : Vidéo courte dynamique
   - 📸 **Post** : Publication statique ou carousel
3. Remplissez les informations :
   - **Client** : Sélectionnez le client concerné
   - **Titre** : Nom du concept (ex: "Reel lancement produit")
   - **Description** : Détails du concept
   - **Objectif** : But du contenu (ex: "Générer du buzz")
4. Choisissez le **statut initial** :
   - **Brouillon** : À finaliser avant envoi
   - **Proposé** : Envoi immédiat au client

---

### **2. Envoi pour Approbation**

**Statut** : Draft → Proposed

#### Actions Admin :
- Dans la colonne **"Brouillon"**, cliquez sur le bouton **"Envoyer"**
- Le concept passe en colonne **"Proposé"**
- Le client voit le concept dans son espace **"En attente"**

---

### **3. Décision du Client (Client Portal)**

**Qui** : Client  
**Où** : Client Portal → `/client-portal/concept-approvals`

#### Onglets disponibles :
- **En attente** : Concepts à valider
- **Approuvés** : Concepts validés
- **Rejetés** : Concepts refusés

#### Actions possibles :
1. **Approuver** ✅
   - Commentaire optionnel
   - Statut → **Approved**
   
2. **Rejeter** ❌
   - Raison **OBLIGATOIRE**
   - Statut → **Rejected**

---

### **4. Traitement Post-Décision (Admin)**

#### Si Approuvé :
- Statut **FINAL** : aucune modification possible
- Le concept peut passer en production
- Visible dans la colonne **"Approuvé"**

#### Si Rejeté :
- Consulter la **raison du rejet** dans la carte concept
- **Modifier** le concept selon les retours
- **Renvoyer** pour approbation → Statut redevient **Proposed**
- Le client voit "Version mise à jour"

---

## 🎨 Types de Concepts

### Reel 🎬
- **Durée** : 15-90 secondes
- **Format** : Vidéo verticale dynamique
- **Objectif** : Engagement rapide, viralité
- **Couleur** : Dégradé rose-rouge

### Post 📸
- **Format** : Image unique, carousel ou vidéo courte
- **Durée** : Contenu permanent
- **Objectif** : Information, témoignage, annonce
- **Couleur** : Dégradé bleu-indigo

---

## 📊 Statuts des Concepts

| Statut | Description | Icône | Couleur | Actions |
|--------|-------------|-------|---------|---------|
| **Draft** | Brouillon en préparation | 📝 | Gris | Envoyer, Modifier, Supprimer |
| **Proposed** | En attente validation client | ⏳ | Bleu | Attendre décision client |
| **Approved** | Validé par le client | ✅ | Vert | Production possible |
| **Rejected** | Refusé par le client | ❌ | Rouge | Modifier et renvoyer |

---

## 💡 Bonnes Pratiques

### Côté Admin
1. **Titre clair et explicite** : "Reel lancement produit été 2026"
2. **Description détaillée** : Incluez le script, le ton, les éléments visuels
3. **Objectif précis** : Alignez avec la stratégie marketing du client
4. **Vérification avant envoi** : Relisez le concept en mode "brouillon"

### Côté Client
1. **Délai de réponse** : Répondez sous 48h pour maintenir le calendrier
2. **Feedback constructif** : Expliquez clairement les raisons de rejet
3. **Communication** : Utilisez les commentaires pour ajuster
4. **Vision long terme** : Pensez à la cohérence de votre stratégie

---

## 🔄 Cycle de Vie Complet

```
[ADMIN] Créer concept
    ↓
[DRAFT] Brouillon
    ↓
[ADMIN] Finaliser & Envoyer
    ↓
[PROPOSED] En attente
    ↓
[CLIENT] Consulter & Décider
    ↓
    ├─→ [APPROVED] ✅ → Production
    │
    └─→ [REJECTED] ❌ → [ADMIN] Modifier → [PROPOSED] (nouvelle version)
```

---

## 📈 Statistiques & Suivi

### Dashboard Admin
- Compteur par statut (Draft, Proposed, Approved, Rejected)
- Filtres par client, type, recherche
- Vue Kanban pour suivi visuel

### Client Portal
- 3 cartes résumé (En attente, Approuvés, Rejetés)
- Filtrage par onglets
- Historique complet avec raisons de rejet

---

## ⚡ Raccourcis & Astuces

### Admin
- **Créer rapidement** : Dupliquez un concept existant (futur)
- **Templates** : Créez des modèles par type de client (futur)
- **Batch approval** : Envoyez plusieurs concepts à la fois

### Client
- **Notifications** : Activez les alertes email (futur)
- **Mobile** : Interface responsive, validez depuis votre smartphone
- **Historique** : Consultez vos décisions passées dans "Approuvés" et "Rejetés"

---

## 🆘 FAQ

### **Un concept approuvé peut-il être modifié ?**
Non, le statut "Approved" est final. Si vous devez modifier, créez un nouveau concept.

### **Combien de temps le client a-t-il pour répondre ?**
Aucune limite technique, mais recommandé sous 48-72h pour respecter les délais.

### **Peut-on renvoyer un concept rejeté plusieurs fois ?**
Oui, vous pouvez modifier et renvoyer autant de fois que nécessaire.

### **Les concepts sont-ils liés aux mandats ?**
Oui, vous pouvez optionnellement lier un concept à un mandat spécifique (champ `mandat_id`).

### **Comment supprimer un concept ?**
Seuls les concepts en "Brouillon" peuvent être supprimés (bouton poubelle).

---

## 🔐 Permissions

| Action | Admin | Client |
|--------|-------|--------|
| Créer concept | ✅ | ❌ |
| Modifier concept | ✅ | ❌ |
| Envoyer pour approbation | ✅ | ❌ |
| Approuver/Rejeter | ❌ | ✅ |
| Supprimer concept | ✅ | ❌ |
| Consulter ses concepts | ✅ | ✅ |

---

**Support** : Pour toute question, contactez l'équipe technique BYZCLUB.  
**Version** : 1.0 - Février 2026
