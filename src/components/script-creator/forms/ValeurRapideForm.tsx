"use client";

import { useState } from "react";
import { ValeurRapideData, CTA_OPTIONS, MAX_FIELD_LENGTH } from "@/types/script-structures";
import { AlertCircle } from "lucide-react";

interface ValeurRapideFormProps {
  data: Partial<ValeurRapideData>;
  onChange: (data: Partial<ValeurRapideData>) => void;
}

export function ValeurRapideForm({ data, onChange }: ValeurRapideFormProps) {
  const [charCounts, setCharCounts] = useState<Record<string, number>>({});

  const handleFieldChange = (field: keyof ValeurRapideData, value: string) => {
    onChange({ ...data, [field]: value });
    setCharCounts({ ...charCounts, [field]: value.length });
  };

  const getFieldWarning = (field: string, length: number) => {
    if (length > MAX_FIELD_LENGTH) {
      return "Texte trop long - risque de dépasser 60 secondes";
    }
    if (length > MAX_FIELD_LENGTH * 0.8) {
      return "Attention à la longueur";
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
        <h3 className="font-bold text-blue-900 mb-2">📚 Structure #1 — Valeur rapide (3 points)</h3>
        <p className="text-sm text-blue-800">
          Idéal pour : Tutoriels, conseils, astuces, erreurs à éviter
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Logique : Hook → Promesse → 3 actions → Bénéfice → CTA
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Hook (douleur / curiosité / désir) *
        </label>
        <textarea
          value={data.hook || ""}
          onChange={(e) => handleFieldChange("hook", e.target.value)}
          placeholder='Ex: "Tu fais X mais ça ne marche pas ?"'
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-gray-900 min-h-[80px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {(data.hook || "").length} / {MAX_FIELD_LENGTH} caractères
          </span>
          {getFieldWarning("hook", (data.hook || "").length) && (
            <span className="text-xs text-orange-600 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {getFieldWarning("hook", (data.hook || "").length)}
            </span>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Promesse / Résultat attendu *
        </label>
        <textarea
          value={data.promesse || ""}
          onChange={(e) => handleFieldChange("promesse", e.target.value)}
          placeholder='Ex: "Voici 3 actions simples pour..."'
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-gray-900 min-h-[80px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.promesse || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-xl border-2 border-orange-200">
        <h4 className="font-bold text-gray-900 mb-3">Les 3 actions concrètes</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Point 1 (action concrète) *
            </label>
            <textarea
              value={data.point1 || ""}
              onChange={(e) => handleFieldChange("point1", e.target.value)}
              placeholder="Première action claire et actionnable"
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[70px]"
              maxLength={MAX_FIELD_LENGTH}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Point 2 (action concrète) *
            </label>
            <textarea
              value={data.point2 || ""}
              onChange={(e) => handleFieldChange("point2", e.target.value)}
              placeholder="Deuxième action claire et actionnable"
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[70px]"
              maxLength={MAX_FIELD_LENGTH}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Point 3 (action concrète) *
            </label>
            <textarea
              value={data.point3 || ""}
              onChange={(e) => handleFieldChange("point3", e.target.value)}
              placeholder="Troisième action claire et actionnable"
              className="w-full px-4 py-3 border-2 border-orange-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[70px]"
              maxLength={MAX_FIELD_LENGTH}
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Bénéfice final *
        </label>
        <textarea
          value={data.benefice || ""}
          onChange={(e) => handleFieldChange("benefice", e.target.value)}
          placeholder='Ex: "Résultat : plus de clarté / clients / temps"'
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-gray-900 min-h-[80px]"
          maxLength={MAX_FIELD_LENGTH}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Call-to-Action (CTA) *
        </label>
        <select
          value={data.cta || ""}
          onChange={(e) => handleFieldChange("cta", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-gray-900 font-medium"
        >
          <option value="">Sélectionner un CTA</option>
          {CTA_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
