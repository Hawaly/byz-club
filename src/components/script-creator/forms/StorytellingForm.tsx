"use client";

import { StorytellingData, CTA_OPTIONS, MAX_FIELD_LENGTH } from "@/types/script-structures";
import { AlertCircle } from "lucide-react";

interface StorytellingFormProps {
  data: Partial<StorytellingData>;
  onChange: (data: Partial<StorytellingData>) => void;
}

export function StorytellingForm({ data, onChange }: StorytellingFormProps) {
  const handleFieldChange = (field: keyof StorytellingData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg">
        <h3 className="font-bold text-purple-900 mb-2">💜 Structure #2 — Storytelling percutant</h3>
        <p className="text-sm text-purple-800">
          Idéal pour : Personal branding, story de client, parcours pro
        </p>
        <p className="text-xs text-purple-700 mt-2">
          Logique : Moment intrigant → Contexte → Tension → Leçon + CTA
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Moment intrigant (début de l'histoire) *
        </label>
        <textarea
          value={data.momentIntrigant || ""}
          onChange={(e) => handleFieldChange("momentIntrigant", e.target.value)}
          placeholder="Commence par un moment qui capte l'attention..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.momentIntrigant || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Contexte (avant) *
        </label>
        <textarea
          value={data.contexte || ""}
          onChange={(e) => handleFieldChange("contexte", e.target.value)}
          placeholder="Décris la situation avant..."
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.contexte || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Tension / difficulté *
        </label>
        <textarea
          value={data.tension || ""}
          onChange={(e) => handleFieldChange("tension", e.target.value)}
          placeholder="Quel était le problème ou le défi ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.tension || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Leçon / Déclic *
        </label>
        <textarea
          value={data.lecon || ""}
          onChange={(e) => handleFieldChange("lecon", e.target.value)}
          placeholder="Quelle leçon en as-tu tiré ?"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 min-h-[100px]"
          maxLength={MAX_FIELD_LENGTH}
        />
        <span className="text-xs text-gray-500">
          {(data.lecon || "").length} / {MAX_FIELD_LENGTH} caractères
        </span>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-900 mb-2">
          Call-to-Action (CTA) *
        </label>
        <select
          value={data.cta || ""}
          onChange={(e) => handleFieldChange("cta", e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-gray-900 font-medium"
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
