"use client";

import { ScriptValidation, ScriptFormData, ScriptStructure } from "@/types/script-structures";
import { CheckCircle2, AlertCircle, XCircle } from "lucide-react";

interface ScriptValidatorProps {
  structure: ScriptStructure;
  data: Partial<ScriptFormData>;
}

export function ScriptValidator({ structure, data }: ScriptValidatorProps) {
  const validation = validateScript(structure, data);

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
        <CheckCircle2 className="w-5 h-5 text-brand-orange" />
        Checklist automatique
      </h3>

      <div className="space-y-3">
        <ValidationItem
          label="Hook présent"
          isValid={validation.hasHook}
          description="Un accroche claire pour capter l'attention"
        />
        <ValidationItem
          label="Structure complète"
          isValid={validation.isComplete}
          description="Tous les champs obligatoires sont remplis"
        />
        <ValidationItem
          label="CTA défini"
          isValid={validation.hasCTA}
          description="Un appel à l'action clair"
        />
        <ValidationItem
          label="Objectif clair"
          isValid={validation.hasObjective}
          description="L'objectif de la vidéo est bien défini"
        />
      </div>

      {validation.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-orange-900 text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Alertes
          </h4>
          {validation.warnings.map((warning, index) => (
            <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded text-sm text-orange-800">
              {warning}
            </div>
          ))}
        </div>
      )}

      {validation.isComplete && validation.hasHook && validation.hasCTA && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-3 rounded">
          <p className="text-sm text-green-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Script prêt à être généré !
          </p>
        </div>
      )}
    </div>
  );
}

function ValidationItem({ label, isValid, description }: { label: string; isValid: boolean; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200">
      {isValid ? (
        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      ) : (
        <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={`font-semibold text-sm ${isValid ? "text-green-900" : "text-gray-500"}`}>
          {label}
        </p>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function validateScript(structure: ScriptStructure, data: Partial<ScriptFormData>): ScriptValidation {
  const warnings: string[] = [];
  let hasHook = false;
  let isComplete = false;
  let hasCTA = false;
  const hasObjective = true;

  switch (structure) {
    case "valeur-rapide": {
      const d = data as any;
      hasHook = !!d.hook && d.hook.trim().length > 0;
      hasCTA = !!d.cta;
      isComplete = !!(
        d.hook &&
        d.promesse &&
        d.point1 &&
        d.point2 &&
        d.point3 &&
        d.benefice &&
        d.cta
      );

      if (!hasHook) warnings.push("Ton hook n'est pas assez clair");
      if (d.hook && d.hook.length < 20) warnings.push("Le hook est trop court");
      if (!d.point1 || !d.point2 || !d.point3) warnings.push("Les 3 points d'action sont requis");
      
      const totalLength = (d.hook?.length || 0) + (d.promesse?.length || 0) + 
                         (d.point1?.length || 0) + (d.point2?.length || 0) + 
                         (d.point3?.length || 0) + (d.benefice?.length || 0);
      if (totalLength > 2000) warnings.push("Le script risque de dépasser 60 secondes");
      
      break;
    }

    case "storytelling": {
      const d = data as any;
      hasHook = !!d.momentIntrigant && d.momentIntrigant.trim().length > 0;
      hasCTA = !!d.cta;
      isComplete = !!(
        d.momentIntrigant &&
        d.contexte &&
        d.tension &&
        d.lecon &&
        d.cta
      );

      if (!hasHook) warnings.push("Le moment intrigant doit capter l'attention");
      if (!d.tension) warnings.push("La tension est essentielle pour une bonne histoire");
      break;
    }

    case "transformation": {
      const d = data as any;
      hasHook = !!d.situationCritique && d.situationCritique.trim().length > 0;
      hasCTA = !!d.cta;
      isComplete = !!(
        d.situationCritique &&
        d.accumulationProblemes &&
        d.priseConscience &&
        d.nouvelleSituation &&
        d.cta
      );

      if (!hasHook) warnings.push("La situation critique doit être impactante");
      if (!d.priseConscience) warnings.push("Le déclic est crucial pour la transformation");
      break;
    }

    case "mythe": {
      const d = data as any;
      hasHook = !!d.mytheCourant && d.mytheCourant.trim().length > 0;
      hasCTA = !!d.cta;
      isComplete = !!(
        d.mytheCourant &&
        d.realite &&
        d.preuvePersonnelle &&
        d.nouvelleCroyance &&
        d.cta
      );

      if (!hasHook) warnings.push("Le mythe doit être clairement énoncé");
      if (!d.preuvePersonnelle) warnings.push("Une preuve concrète renforce ton argument");
      break;
    }

    case "voyage-inverse": {
      const d = data as any;
      hasHook = !!d.resultatObtenu && d.resultatObtenu.trim().length > 0;
      hasCTA = !!d.cta;
      isComplete = !!(
        d.resultatObtenu &&
        d.ceQueNestPas &&
        d.etapesCles &&
        d.principe &&
        d.cta
      );

      if (!hasHook) warnings.push("Le résultat doit être impressionnant");
      if (!d.etapesCles) warnings.push("Les étapes clés sont essentielles pour la crédibilité");
      break;
    }
  }

  if (!hasCTA) warnings.push("Il manque un CTA");

  return {
    hasHook,
    isComplete,
    hasCTA,
    isSimpleLanguage: true,
    hasObjective,
    warnings
  };
}
