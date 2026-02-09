"use client";

import { ScriptFormData, ScriptStructure, CTA_OPTIONS } from "@/types/script-structures";

export function generateScript(structure: ScriptStructure, data: Partial<ScriptFormData>): string {
  switch (structure) {
    case "valeur-rapide":
      return generateValeurRapide(data as any);
    case "storytelling":
      return generateStorytelling(data as any);
    case "transformation":
      return generateTransformation(data as any);
    case "mythe":
      return generateMythe(data as any);
    case "voyage-inverse":
      return generateVoyageInverse(data as any);
    default:
      return "";
  }
}

function generateValeurRapide(data: any): string {
  const ctaLabel = CTA_OPTIONS.find(opt => opt.value === data.cta)?.label || "";
  
  return `
<h2>🎯 Hook</h2>
<p>${data.hook || ""}</p>

<h2>✨ Promesse</h2>
<p>${data.promesse || ""}</p>

<h2>📋 Les 3 Actions</h2>

<h3>1️⃣ Action 1</h3>
<p>${data.point1 || ""}</p>

<h3>2️⃣ Action 2</h3>
<p>${data.point2 || ""}</p>

<h3>3️⃣ Action 3</h3>
<p>${data.point3 || ""}</p>

<h2>🎁 Bénéfice Final</h2>
<p>${data.benefice || ""}</p>

<h2>📣 Call-to-Action</h2>
<p><strong>${ctaLabel}</strong></p>
`.trim();
}

function generateStorytelling(data: any): string {
  const ctaLabel = CTA_OPTIONS.find(opt => opt.value === data.cta)?.label || "";
  
  return `
<h2>🎬 Moment Intrigant</h2>
<p>${data.momentIntrigant || ""}</p>

<h2>📖 Contexte (Avant)</h2>
<p>${data.contexte || ""}</p>

<h2>⚡ Tension / Difficulté</h2>
<p>${data.tension || ""}</p>

<h2>💡 Leçon / Déclic</h2>
<p>${data.lecon || ""}</p>

<h2>📣 Call-to-Action</h2>
<p><strong>${ctaLabel}</strong></p>
`.trim();
}

function generateTransformation(data: any): string {
  const ctaLabel = CTA_OPTIONS.find(opt => opt.value === data.cta)?.label || "";
  
  return `
<h2>🌑 Situation Critique</h2>
<p>${data.situationCritique || ""}</p>

<h2>⛈️ Accumulation de Problèmes</h2>
<p>${data.accumulationProblemes || ""}</p>

<h2>💫 Prise de Conscience</h2>
<p>${data.priseConscience || ""}</p>

<h2>🌟 Nouvelle Situation</h2>
<p>${data.nouvelleSituation || ""}</p>

<h2>📣 Call-to-Action</h2>
<p><strong>${ctaLabel}</strong></p>
`.trim();
}

function generateMythe(data: any): string {
  const ctaLabel = CTA_OPTIONS.find(opt => opt.value === data.cta)?.label || "";
  
  return `
<h2>❌ Mythe Courant</h2>
<p>${data.mytheCourant || ""}</p>

<h2>✅ Réalité</h2>
<p>${data.realite || ""}</p>

<h2>🔍 Preuve Personnelle</h2>
<p>${data.preuvePersonnelle || ""}</p>

<h2>🎯 Nouvelle Croyance</h2>
<p>${data.nouvelleCroyance || ""}</p>

<h2>📣 Call-to-Action</h2>
<p><strong>${ctaLabel}</strong></p>
`.trim();
}

function generateVoyageInverse(data: any): string {
  const ctaLabel = CTA_OPTIONS.find(opt => opt.value === data.cta)?.label || "";
  
  return `
<h2>🏆 Résultat Obtenu</h2>
<p>${data.resultatObtenu || ""}</p>

<h2>🚫 Ce que ce N'EST PAS</h2>
<p>${data.ceQueNestPas || ""}</p>

<h2>🔑 Étapes Clés</h2>
<p>${data.etapesCles || ""}</p>

<h2>💎 Principe à Retenir</h2>
<p>${data.principe || ""}</p>

<h2>📣 Call-to-Action</h2>
<p><strong>${ctaLabel}</strong></p>
`.trim();
}

export function getStructureName(structure: ScriptStructure): string {
  const names: Record<ScriptStructure, string> = {
    "valeur-rapide": "Valeur rapide (3 points)",
    "storytelling": "Storytelling percutant",
    "transformation": "Toucher le fond (Transformation)",
    "mythe": "Casser un mythe",
    "voyage-inverse": "Voyage inversé (Autorité)"
  };
  return names[structure] || structure;
}
