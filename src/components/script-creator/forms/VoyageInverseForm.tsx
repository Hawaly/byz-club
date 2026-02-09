"use client";

import { VoyageInverseData, CTA_OPTIONS, MAX_FIELD_LENGTH } from "@/types/script-structures";

interface VoyageInverseFormProps {
  data: Partial<VoyageInverseData>;
  onChange: (data: Partial<VoyageInverseData>) => void;
}

export function VoyageInverseForm({ data, onChange }: VoyageInverseFormProps) {
  const handleFieldChange = (field: keyof VoyageInverseData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <h3 className="font-bold text-red-900 mb-2">🏆 Structure #5 — Voyage inversé (Autorité)</h3>
        <p className="text-sm text-red-800">
          Idéal pour : Vente, expertise, crédibilité
        </p>
        <p className="text-xs text-red-700 mt-2">
          Logique : Résultat → Déconstruction → Process → Principe → CTA
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Résultat obtenu *
        </label>
        <textarea
          value={data.resultatObtenu || ""}
          onChange={(e) => handleFieldChange("resultatObtenu", e.target.value)}
          placeholder="Commence par le résultat impressionnant que tu as obtenu..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.resultatObtenu || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Ce que ce n'est PAS *
        </label>
        <textarea
          value={data.ceQueNestPas || ""}
          onChange={(e) => handleFieldChange("ceQueNestPas", e.target.value)}
          placeholder="Ex: Ce n'est pas de la chance, ce n'est pas..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.ceQueNestPas || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Étapes clés *
        </label>
        <textarea
          value={data.etapesCles || ""}
          onChange={(e) => handleFieldChange("etapesCles", e.target.value)}
          placeholder="Quelles sont les étapes concrètes que tu as suivies ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.etapesCles || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Principe à retenir *
        </label>
        <textarea
          value={data.principe || ""}
          onChange={(e) => handleFieldChange("principe", e.target.value)}
          placeholder="Quel est le principe fondamental derrière ce succès ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.principe || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Call-to-Action (CTA) *
        </label>
        <select
          value={data.cta || ""}
          onChange={(e) => handleFieldChange("cta", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/20 text-gray-900 font-medium"
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
