-- Vérifier quels statuts existent dans social_media_strategy

-- 1. Voir tous les statuts utilisés
SELECT DISTINCT status, COUNT(*) as count
FROM social_media_strategy
GROUP BY status
ORDER BY count DESC;

-- 2. Voir toutes les stratégies avec leurs statuts
SELECT 
  id,
  client_id,
  status,
  version,
  created_at
FROM social_media_strategy
ORDER BY created_at DESC
LIMIT 20;

-- 3. Vérifier s'il y a des piliers pour n'importe quelle stratégie
SELECT 
  s.id as strategy_id,
  s.status,
  s.client_id,
  COUNT(pc.id) as nombre_piliers
FROM social_media_strategy s
LEFT JOIN pilier_contenu pc ON pc.strategy_id = s.id
GROUP BY s.id, s.status, s.client_id
HAVING COUNT(pc.id) > 0
ORDER BY s.id DESC;
