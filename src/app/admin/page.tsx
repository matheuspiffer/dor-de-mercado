"use client";

import { useState, useEffect } from "react";

interface ResponseData {
  id: string;
  name: string;
  email: string;
  role: string;
  industry: string;
  painPoint: string;
  frequency: string;
  currentSolution: string;
  willingToPay: string;
  additionalInfo: string;
  createdAt: string;
}

const WILLING_LABELS: Record<string, string> = {
  sim_ja_pago: "Já paga por algo parecido",
  sim_pagaria: "Pagaria se resolvesse bem",
  talvez: "Talvez, depende do valor",
  nao: "Prefere soluções gratuitas",
};

export default function AdminPage() {
  const [secret, setSecret] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<ResponseData | null>(null);

  const fetchResponses = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/responses?secret=${encodeURIComponent(secret)}`);
      if (!res.ok) {
        if (res.status === 401) throw new Error("Senha incorreta.");
        throw new Error("Erro ao carregar.");
      }
      const data = await res.json();
      setResponses(data);
      setAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h1 className="text-xl font-bold text-white mb-2">Painel Admin</h1>
            <p className="text-slate-400 text-sm mb-6">
              Insira a senha para acessar as respostas.
            </p>
            <input
              type="password"
              className="input-field mb-4"
              placeholder="Senha de acesso"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchResponses()}
            />
            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}
            <button
              onClick={fetchResponses}
              disabled={loading || !secret}
              className="btn-primary"
            >
              {loading ? "Verificando..." : "Acessar"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Stats
  const totalResponses = responses.length;
  const wouldPay = responses.filter(
    (r) => r.willingToPay === "sim_ja_pago" || r.willingToPay === "sim_pagaria"
  ).length;
  const dailyPain = responses.filter(
    (r) => r.frequency === "diariamente"
  ).length;

  const industryCount: Record<string, number> = {};
  responses.forEach((r) => {
    industryCount[r.industry] = (industryCount[r.industry] || 0) + 1;
  });
  const topIndustry = Object.entries(industryCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return (
    <main className="flex-1 px-4 py-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Painel de Respostas</h1>
          <p className="text-slate-400 text-sm">
            {totalResponses} resposta{totalResponses !== 1 ? "s" : ""} coletada
            {totalResponses !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchResponses}
          className="px-4 py-2 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5 transition-all text-sm"
        >
          Atualizar
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass-card p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Total de Respostas
          </p>
          <p className="text-3xl font-bold text-white">{totalResponses}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Pagariam por Solução
          </p>
          <p className="text-3xl font-bold text-green-400">
            {totalResponses > 0
              ? Math.round((wouldPay / totalResponses) * 100)
              : 0}
            %
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Problema Diário
          </p>
          <p className="text-3xl font-bold text-orange-400">
            {totalResponses > 0
              ? Math.round((dailyPain / totalResponses) * 100)
              : 0}
            %
          </p>
        </div>
        <div className="glass-card p-5">
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
            Top Indústria
          </p>
          <p className="text-xl font-bold text-indigo-300">
            {topIndustry ? topIndustry[0] : "—"}
          </p>
        </div>
      </div>

      {/* Response List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="lg:col-span-1 space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {responses.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`w-full text-left glass-card p-4 transition-all hover:border-indigo-500/40 ${
                selected?.id === r.id ? "border-indigo-500/60 bg-indigo-500/10" : ""
              }`}
            >
              <p className="font-medium text-white text-sm">{r.name}</p>
              <p className="text-xs text-slate-400">
                {r.role} · {r.industry}
              </p>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {r.painPoint}
              </p>
              <p className="text-xs text-slate-600 mt-1">
                {new Date(r.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </button>
          ))}
          {responses.length === 0 && (
            <div className="glass-card p-8 text-center">
              <p className="text-slate-400">Nenhuma resposta ainda.</p>
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="glass-card p-6 space-y-5 animate-in">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {selected.name}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {selected.email} · {selected.role} · {selected.industry}
                  </p>
                </div>
                <span className="text-xs text-slate-500 bg-white/5 px-3 py-1 rounded-full">
                  {new Date(selected.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Maior Desafio
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {selected.painPoint}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                    Frequência
                  </h3>
                  <p className="text-slate-200 text-sm capitalize">
                    {selected.frequency}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                    Disposição a Pagar
                  </h3>
                  <p className="text-slate-200 text-sm">
                    {WILLING_LABELS[selected.willingToPay] ||
                      selected.willingToPay}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                  Solução Atual
                </h3>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {selected.currentSolution}
                </p>
              </div>

              {selected.additionalInfo && (
                <div>
                  <h3 className="text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-1">
                    Informações Adicionais
                  </h3>
                  <p className="text-slate-200 text-sm leading-relaxed">
                    {selected.additionalInfo}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-12 text-center">
              <p className="text-slate-400">
                Selecione uma resposta para ver os detalhes.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
