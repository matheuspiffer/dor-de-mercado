import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      role,
      industry,
      painPoint,
      frequency,
      currentSolution,
      willingToPay,
      additionalInfo,
    } = body;

    // Validação básica
    if (!name || !email || !role || !industry || !painPoint || !frequency || !currentSolution || !willingToPay) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos." },
        { status: 400 }
      );
    }

    const response = await prisma.response.create({
      data: {
        name,
        email,
        role,
        industry,
        painPoint,
        frequency,
        currentSolution,
        willingToPay,
        additionalInfo: additionalInfo || "",
      },
    });

    return NextResponse.json({ success: true, id: response.id }, { status: 201 });
  } catch (error) {
    console.error("Erro ao salvar resposta:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Autenticação simples via query param (troque por algo mais robusto em produção)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");

    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const responses = await prisma.response.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error("Erro ao buscar respostas:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
