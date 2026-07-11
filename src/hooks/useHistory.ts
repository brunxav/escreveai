"use client";

import { useState, useEffect } from "react";
import { GeneratedText } from "@/types";

const STORAGE_KEY = "escreveai-history";
const MAX_ITEMS = 5;

export function useHistory() {
  const [history, setHistory] = useState<GeneratedText[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setHistory(parsed.map((item: GeneratedText) => ({
          ...item,
          createdAt: new Date(item.createdAt),
        })));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
  }, [history, isLoaded]);

  const addToHistory = (item: Omit<GeneratedText, "id" | "createdAt">) => {
    const newItem: GeneratedText = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev];
      return updated.slice(0, MAX_ITEMS);
    });

    return newItem;
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, addToHistory, clearHistory, isLoaded };
}
