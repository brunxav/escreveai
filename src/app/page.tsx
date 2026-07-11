"use client";

import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TextGenerator } from "@/components/TextGenerator";
import { HistoryList } from "@/components/HistoryList";
import { useHistory } from "@/hooks/useHistory";
import { GeneratedText } from "@/types";

export default function Home() {
  const { history, addToHistory, clearHistory } = useHistory();

  const handleSelectFromHistory = (item: GeneratedText) => {
    const generatorSection = document.getElementById("gerador");
    if (generatorSection) {
      generatorSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      <Hero />

      <section id="gerador" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Gere seu texto agora
            </h2>
            <p className="text-gray-400">
              Escolha o tipo, preencha os campos e clique em gerar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <TextGenerator onGenerate={addToHistory} />
            </div>
            <div className="md:col-span-1">
              <HistoryList
                history={history}
                onSelect={handleSelectFromHistory}
                onClear={clearHistory}
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-gray-500 text-sm">
          <p>EscreveAI &copy; {new Date().getFullYear()} - Gerador de textos com IA</p>
        </div>
      </footer>
    </div>
  );
}
