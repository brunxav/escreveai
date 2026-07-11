import Link from "next/link";
import { TEXT_TYPE_CONFIGS } from "@/lib/prompts";

export function Hero() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
          Gere textos profissionais
          <br />
          <span className="text-violet-500">com IA em segundos</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Emails, posts do LinkedIn, descrições de produtos e bios profissionais.
          Preencha os campos, clique em gerar e copie o resultado.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {TEXT_TYPE_CONFIGS.map((config) => (
            <div
              key={config.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center hover:border-violet-500/50 transition-colors"
            >
              <span className="text-3xl mb-2 block">{config.icon}</span>
              <span className="text-sm text-gray-300">{config.label}</span>
            </div>
          ))}
        </div>

        <Link
          href="/#gerador"
          className="inline-block bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
        >
          Começar agora
        </Link>
      </div>
    </section>
  );
}
