"use client";

import { useState } from "react";
import { TextType, GeneratedText } from "@/types";
import { TEXT_TYPE_CONFIGS } from "@/lib/prompts";
import { ResultCard } from "./ResultCard";

interface TextGeneratorProps {
  onGenerate: (item: GeneratedText) => void;
}

export function TextGenerator({ onGenerate }: TextGeneratorProps) {
  const [selectedType, setSelectedType] = useState<TextType>("email");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currentConfig = TEXT_TYPE_CONFIGS.find((c) => c.id === selectedType);

  const handleTypeChange = (type: TextType) => {
    setSelectedType(type);
    setInputs({});
    setResult(null);
    setError(null);
  };

  const handleInputChange = (name: string, value: string) => {
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (!currentConfig) return;

    const requiredFields = currentConfig.fields.filter(
      (f) => f.name !== "context"
    );
    const missingFields = requiredFields.filter(
      (f) => !inputs[f.name]?.trim()
    );

    if (missingFields.length > 0) {
      setError(`Preencha os campos: ${missingFields.map((f) => f.label).join(", ")}`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: selectedType, inputs }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao gerar texto");
      }

      setResult(data.text);

      const newItem: GeneratedText = {
        id: crypto.randomUUID(),
        type: selectedType,
        inputs: { ...inputs },
        result: data.text,
        createdAt: new Date(),
      };
      onGenerate(newItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Tipo de texto
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TEXT_TYPE_CONFIGS.map((config) => (
            <button
              key={config.id}
              onClick={() => handleTypeChange(config.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm ${
                selectedType === config.id
                  ? "bg-violet-600/20 border-violet-500 text-violet-300"
                  : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
              }`}
            >
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      {currentConfig && (
        <div className="space-y-4 mb-6">
          {currentConfig.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {field.label}
              </label>
              {field.type === "select" ? (
                <select
                  value={inputs[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="">{field.placeholder}</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  value={inputs[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={inputs[field.name] || ""}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg px-4 py-3 mb-6 text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-violet-600/50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Gerando...
          </>
        ) : (
          "Gerar texto"
        )}
      </button>

      {result && <ResultCard text={result} onReset={() => setResult(null)} />}
    </div>
  );
}
