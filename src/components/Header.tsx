"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✍️</span>
          <span className="text-xl font-bold text-white">
            Escreve<span className="text-violet-500">AI</span>
          </span>
        </Link>
        <nav>
          <Link
            href="/#gerador"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            Começar agora
          </Link>
        </nav>
      </div>
    </header>
  );
}
