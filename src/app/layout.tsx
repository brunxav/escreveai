import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EscreveAI - Gerador de Textos com IA",
  description:
    "Gere emails profissionais, posts do LinkedIn, descrições de produtos e bios profissionais com inteligência artificial.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
