import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { buildPrompt } from "@/lib/prompts";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { TextType } from "@/types";

const VALID_TYPES: TextType[] = ["email", "linkedin", "product", "bio"];

const MAX_FIELD_LENGTH = 2000;

const RATE_LIMIT = { limit: 10, windowMs: 60_000 };

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (origin) {
    try {
      const url = new URL(origin);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const url = new URL(referer);
      if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
    } catch {
      return false;
    }
  }

  return false;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request)) {
    return NextResponse.json(
      { error: "Requisição não autorizada" },
      { status: 403 }
    );
  }

  const ip = getClientIp(request);
  const rateLimitResult = checkRateLimit(ip, RATE_LIMIT.limit, RATE_LIMIT.windowMs);

  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: "Limite de requisições atingido. Tente novamente mais tarde." },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT.limit),
          "X-RateLimit-Remaining": "0",
          "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetAt / 1000)),
          "Retry-After": String(Math.ceil((rateLimitResult.resetAt - Date.now()) / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { type, inputs } = body;

    if (!type || !VALID_TYPES.includes(type)) {
      return NextResponse.json(
        { error: "Tipo de texto inválido" },
        { status: 400 }
      );
    }

    if (!inputs || typeof inputs !== "object") {
      return NextResponse.json(
        { error: "Inputs são obrigatórios" },
        { status: 400 }
      );
    }

    for (const [key, value] of Object.entries(inputs)) {
      if (typeof value !== "string") {
        return NextResponse.json(
          { error: `Campo '${key}' inválido` },
          { status: 400 }
        );
      }
      if (value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json(
          { error: `Campo '${key}' excede o limite de ${MAX_FIELD_LENGTH} caracteres` },
          { status: 400 }
        );
      }
    }

    const promptData = buildPrompt(type, inputs);

    const completion = await openai.chat.completions.create({
      model: "openrouter/free",
      messages: [
        { role: "system", content: promptData.system },
        { role: "user", content: promptData.user },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const text = completion.choices[0]?.message?.content;

    if (!text) {
      return NextResponse.json(
        { error: "Erro ao gerar texto" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { text },
      {
        headers: {
          "X-RateLimit-Limit": String(RATE_LIMIT.limit),
          "X-RateLimit-Remaining": String(rateLimitResult.remaining),
          "X-RateLimit-Reset": String(Math.ceil(rateLimitResult.resetAt / 1000)),
        },
      }
    );
  } catch (error) {
    console.error("Erro na API:", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
