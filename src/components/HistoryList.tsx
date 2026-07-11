"use client";

import { GeneratedText } from "@/types";
import { TEXT_TYPE_CONFIGS } from "@/lib/prompts";

interface HistoryListProps {
  history: GeneratedText[];
  onSelect: (item: GeneratedText) => void;
  onClear: () => void;
}

export function HistoryList({ history, onSelect, onClear }: HistoryListProps) {
  if (history.length === 0) return null;

  const getTypeLabel = (type: string) => {
    return TEXT_TYPE_CONFIGS.find((c) => c.id === type)?.label || type;
  };

  const getTypeIcon = (type: string) => {
    return TEXT_TYPE_CONFIGS.find((c) => c.id === type)?.icon || "📝";
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Histórico</h2>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          Limpar tudo
        </button>
      </div>
      <div className="space-y-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full text-left bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 rounded-lg p-4 transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>{getTypeIcon(item.type)}</span>
                <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                  {getTypeLabel(item.type)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatTime(item.createdAt)}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">
              {item.result.substring(0, 80)}...
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
