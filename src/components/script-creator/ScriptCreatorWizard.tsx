"use client";

import { useState } from "react";
import { ScriptObjective, ScriptStructure, ScriptFormData, SCRIPT_OBJECTIVES } from "@/types/script-structures";
import { ObjectiveSelector } from "./ObjectiveSelector";
import { ValeurRapideForm } from "./forms/ValeurRapideForm";
import { StorytellingForm } from "./forms/StorytellingForm";
import { TransformationForm } from "./forms/TransformationForm";
import { MytheForm } from "./forms/MytheForm";
import { VoyageInverseForm } from "./forms/VoyageInverseForm";
import { ScriptValidator } from "./ScriptValidator";
import { generateScript, getStructureName } from "./ScriptGenerator";
import { ArrowLeft, Sparkles, Copy, CheckCircle2 } from "lucide-react";

interface ScriptCreatorWizardProps {
  onComplete: (title: string, content: string) => void;
  onCancel: () => void;
}

export function ScriptCreatorWizard({ onComplete, onCancel }: ScriptCreatorWizardProps) {
  const [step, setStep] = useState<"objective" | "form" | "preview">("objective");
  const [selectedObjective, setSelectedObjective] = useState<ScriptObjective | null>(null);
  const [selectedStructure, setSelectedStructure] = useState<ScriptStructure | null>(null);
  const [formData, setFormData] = useState<Partial<ScriptFormData>>({});
  const [generatedScript, setGeneratedScript] = useState<string>("");
  const [scriptTitle, setScriptTitle] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleObjectiveSelect = (objective: ScriptObjective) => {
    setSelectedObjective(objective);
    const objectiveConfig = SCRIPT_OBJECTIVES.find(o => o.id === objective);
    if (objectiveConfig) {
      setSelectedStructure(objectiveConfig.structure);
      setStep("form");
    }
  };

  const handleFormChange = (data: Partial<ScriptFormData>) => {
    setFormData(data);
  };

  const handleGenerateScript = () => {
    if (!selectedStructure) return;
    const script = generateScript(selectedStructure, formData);
    setGeneratedScript(script);
    
    if (!scriptTitle) {
      const structureName = getStructureName(selectedStructure);
      setScriptTitle(`Script ${structureName} - ${new Date().toLocaleDateString('fr-FR')}`);
    }
    
    setStep("preview");
  };

  const handleCopyScript = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedScript;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveScript = () => {
    onComplete(scriptTitle, generatedScript);
  };

  const renderForm = () => {
    if (!selectedStructure) return null;

    switch (selectedStructure) {
      case "valeur-rapide":
        return <ValeurRapideForm data={formData} onChange={handleFormChange} />;
      case "storytelling":
        return <StorytellingForm data={formData} onChange={handleFormChange} />;
      case "transformation":
        return <TransformationForm data={formData} onChange={handleFormChange} />;
      case "mythe":
        return <MytheForm data={formData} onChange={handleFormChange} />;
      case "voyage-inverse":
        return <VoyageInverseForm data={formData} onChange={handleFormChange} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {step === "objective" && (
        <div className="flex-1 overflow-y-auto p-6">
          <ObjectiveSelector onSelect={handleObjectiveSelect} />
        </div>
      )}

      {step === "form" && selectedStructure && (
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <button
              onClick={() => setStep("objective")}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-orange mb-6 font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Changer d'objectif
            </button>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getStructureName(selectedStructure)}
              </h2>
              <p className="text-gray-600">
                Remplis les champs ci-dessous pour créer ton script
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {renderForm()}
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <ScriptValidator structure={selectedStructure} data={formData} />
                  
                  <button
                    onClick={handleGenerateScript}
                    className="w-full mt-4 px-6 py-4 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Générer le script
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="flex-1 overflow-y-auto p-6">
          <button
            onClick={() => setStep("form")}
            className="flex items-center gap-2 text-gray-600 hover:text-brand-orange mb-6 font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Modifier le script
          </button>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold text-green-900">Script généré avec succès !</h2>
                  <p className="text-green-700">Ton script est prêt à être utilisé</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Titre du script
              </label>
              <input
                type="text"
                value={scriptTitle}
                onChange={(e) => setScriptTitle(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 text-gray-900 font-medium mb-4"
                placeholder="Donne un titre à ton script"
              />

              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleCopyScript}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copier
                    </>
                  )}
                </button>
              </div>

              <div className="prose max-w-none">
                <div 
                  className="script-preview bg-gray-50 rounded-xl p-6 border-2 border-gray-200"
                  dangerouslySetInnerHTML={{ __html: generatedScript }}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onCancel}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSaveScript}
                disabled={!scriptTitle.trim()}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sauvegarder le script
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
