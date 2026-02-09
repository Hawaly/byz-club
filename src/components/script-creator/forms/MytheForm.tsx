"use client";

import { MytheData, CTA_OPTIONS, MAX_FIELD_LENGTH } from "@/types/script-structures";

interface MytheFormProps {
  data: Partial<MytheData>;
  onChange: (data: Partial<MytheData>) => void;
}

export function MytheForm({ data, onChange }: MytheFormProps) {
  const handleFieldChange = (field: keyof MytheData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
        <h3 className="font-bold text-orange-900 mb-2">🛡️ Structure #4 — Casser un mythe</h3>
        <p className="text-sm text-orange-800">
          Idéal pour : Lever une objection, se différencier, convaincre sans vendre frontalement
        </p>
        <p className="text-xs text-orange-700 mt-2">
          Logique : Croyance → Réalité → Preuve → Leçon → CTA
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Mythe courant *
        </label>
        <textarea
          value={data.mytheCourant || ""}
          onChange={(e) => handleFieldChange("mytheCourant", e.target.value)}
          placeholder='Ex: "Beaucoup pensent que..."'
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.mytheCourant || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Réalité (contre-argument) *
        </label>
        <textarea
          value={data.realite || ""}
          onChange={(e) => handleFieldChange("realite", e.target.value)}
          placeholder='Ex: "En réalité..."'
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.realite || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Preuve personnelle / terrain *
        </label>
        <textarea
          value={data.preuvePersonnelle || ""}
          onChange={(e) => handleFieldChange("preuvePersonnelle", e.target.value)}
          placeholder="Partage ton expérience ou des exemples concrets..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.preuvePersonnelle || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Nouvelle croyance à adopter *
        </label>
        <textarea
          value={data.nouvelleCroyance || ""}
          onChange={(e) => handleFieldChange("nouvelleCroyance", e.target.value)}
          placeholder="Quelle est la bonne façon de voir les choses ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.nouvelleCroyance || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Call-to-Action (CTA) *
        </label>
        <select
          value={data.cta || ""}
          onChange={(e) => handleFieldChange("cta", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 text-gray-900 font-medium"
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
