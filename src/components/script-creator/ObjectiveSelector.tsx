"use client";

import { SCRIPT_OBJECTIVES, ScriptObjective } from "@/types/script-structures";
import { Target, Lightbulb, Heart, Shield, Trophy } from "lucide-react";

interface ObjectiveSelectorProps {
  onSelect: (objective: ScriptObjective) => void;
}

const OBJECTIVE_ICONS = {
  "apporter-valeur": Lightbulb,
  "raconter-histoire": Heart,
  "inspirer-motiver": Target,
  "convaincre-casser-croyance": Shield,
  "montrer-autorite-vendre": Trophy
};

const OBJECTIVE_COLORS = {
  "apporter-valeur": "from-blue-500 to-blue-600",
  "raconter-histoire": "from-purple-500 to-purple-600",
  "inspirer-motiver": "from-green-500 to-green-600",
  "convaincre-casser-croyance": "from-orange-500 to-orange-600",
  "montrer-autorite-vendre": "from-red-500 to-red-600"
};

export function ObjectiveSelector({ onSelect }: ObjectiveSelectorProps) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          Quel est l'objectif de ta vidéo ?
        </h2>
        <p className="text-gray-600 text-lg">
          Choisis l'objectif qui correspond le mieux à ce que tu veux accomplir
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCRIPT_OBJECTIVES.map((objective) => {
          const Icon = OBJECTIVE_ICONS[objective.id];
          const colorClass = OBJECTIVE_COLORS[objective.id];

          return (
            <button
              key={objective.id}
              onClick={() => onSelect(objective.id)}
              className="group relative bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-brand-orange hover:shadow-xl transition-all duration-300 text-left"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${colorClass} rounded-t-2xl`} />
              
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-gradient-to-br ${colorClass} rounded-xl text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-brand-orange transition-colors">
                    {objective.label}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {objective.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end text-sm font-semibold text-gray-400 group-hover:text-brand-orange transition-colors">
                Sélectionner
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
