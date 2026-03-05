-- Vérification des piliers de contenu dans la base de données

-- 1. Vérifier les stratégies actives
SELECT 
  s.id,
  s.client_id,
  c.name as client_name,
  s.status,
  s.version,
  s.created_at
FROM social_media_strategy s
LEFT JOIN client c ON c.id = s.client_id
WHERE s.status = 'actif'
ORDER BY s.created_at DESC;

-- 2. Vérifier les piliers pour chaque stratégie active
SELECT 
  pc.id,
  pc.strategy_id,
  pc.titre,
  pc.description,
  pc.ordre,
  s.client_id,
  c.name as client_name,
  s.status
FROM pilier_contenu pc
LEFT JOIN social_media_strategy s ON s.id = pc.strategy_id
LEFT JOIN client c ON c.id = s.client_id
WHERE s.status = 'actif'
ORDER BY pc.strategy_id, pc.ordre;

-- 3. Compter les piliers par stratégie
SELECT 
  s.id as strategy_id,
  s.client_id,
  c.name as client_name,
  s.status,
  COUNT(pc.id) as nombre_piliers
FROM social_media_strategy s
LEFT JOIN client c ON c.id = s.client_id
LEFT JOIN pilier_contenu pc ON pc.strategy_id = s.id
WHERE s.status = 'actif'
GROUP BY s.id, s.client_id, c.name, s.status
ORDER BY s.id;
