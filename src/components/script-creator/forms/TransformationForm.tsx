"use client";

import { TransformationData, CTA_OPTIONS, MAX_FIELD_LENGTH } from "@/types/script-structures";

interface TransformationFormProps {
  data: Partial<TransformationData>;
  onChange: (data: Partial<TransformationData>) => void;
}

export function TransformationForm({ data, onChange }: TransformationFormProps) {
  const handleFieldChange = (field: keyof TransformationData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
        <h3 className="font-bold text-green-900 mb-2">🌱 Structure #3 — Toucher le fond (Transformation)</h3>
        <p className="text-sm text-green-800">
          Idéal pour : Motivation, inspiration, preuve de changement réel
        </p>
        <p className="text-xs text-green-700 mt-2">
          Logique : Avant → Crise → Déclic → Après → CTA
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Situation critique (hook) *
        </label>
        <textarea
          value={data.situationCritique || ""}
          onChange={(e) => handleFieldChange("situationCritique", e.target.value)}
          placeholder="Décris le moment le plus bas, la situation critique..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.situationCritique || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Accumulation de problèmes *
        </label>
        <textarea
          value={data.accumulationProblemes || ""}
          onChange={(e) => handleFieldChange("accumulationProblemes", e.target.value)}
          placeholder="Quels problèmes s'accumulaient ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.accumulationProblemes || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Prise de conscience clé *
        </label>
        <textarea
          value={data.priseConscience || ""}
          onChange={(e) => handleFieldChange("priseConscience", e.target.value)}
          placeholder="Quel a été le déclic, la prise de conscience ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.priseConscience || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Nouvelle situation *
        </label>
        <textarea
          value={data.nouvelleSituation || ""}
          onChange={(e) => handleFieldChange("nouvelleSituation", e.target.value)}
          placeholder="Où en es-tu maintenant après cette transformation ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.nouvelleSituation || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Call-to-Action (CTA) *
        </label>
        <select
          value={data.cta || ""}
          onChange={(e) => handleFieldChange("cta", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500/20 text-gray-900 font-medium"
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
