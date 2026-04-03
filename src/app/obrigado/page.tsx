"use client";

import Link from "next/link";

export default function ThankYouPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center animate-in">
        <div className="glass-card p-10">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-2xl font-bold text-white mb-3">
            Obrigado pela sua resposta!
          </h1>
          <p className="text-slate-400 mb-2">
            Suas respostas são extremamente valiosas para entendermos os desafios
            reais que profissionais como você enfrentam.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Estamos analisando todas as respostas para criar soluções que
            realmente façam a diferença.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="btn-primary inline-block text-center"
            >
              Enviar outra resposta
            </Link>
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-6">
          Conhece alguém que poderia contribuir? Compartilhe o link do Dor de Mercado!
        </p>
      </div>
    </main>
  );
}
