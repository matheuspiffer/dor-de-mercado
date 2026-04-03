"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const STEPS = [
  { id: 1, title: "Sobre Você" },
  { id: 2, title: "Seus Desafios" },
  { id: 3, title: "Soluções" },
];

const INDUSTRIES = [
  "Tecnologia",
  "Saúde",
  "Educação",
  "Finanças",
  "Marketing / Publicidade",
  "Varejo / E-commerce",
  "Indústria / Manufatura",
  "Consultoria",
  "Jurídico",
  "Recursos Humanos",
  "Logística / Supply Chain",
  "Outro",
];

const FREQUENCIES = [
  { value: "diariamente", label: "Diariamente", emoji: "🔥" },
  { value: "semanalmente", label: "Semanalmente", emoji: "📅" },
  { value: "mensalmente", label: "Mensalmente", emoji: "📆" },
  { value: "raramente", label: "Raramente", emoji: "💤" },
];

const WILLING_TO_PAY = [
  { value: "sim_ja_pago", label: "Sim, já pago por algo parecido", emoji: "💳" },
  { value: "sim_pagaria", label: "Sim, pagaria se resolvesse bem", emoji: "✅" },
  { value: "talvez", label: "Talvez, depende do valor", emoji: "🤔" },
  { value: "nao", label: "Não, prefiro soluções gratuitas", emoji: "🚫" },
];

interface FormData {
  name: string;
  email: string;
  role: string;
  industry: string;
  painPoint: string;
  frequency: string;
  currentSolution: string;
  willingToPay: string;
  additionalInfo: string;
}

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    role: "",
    industry: "",
    painPoint: "",
    frequency: "",
    currentSolution: "",
    willingToPay: "",
    additionalInfo: "",
  });

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) return "Por favor, insira seu nome.";
      if (!formData.email.trim()) return "Por favor, insira seu email.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        return "Email inválido.";
      if (!formData.role.trim()) return "Por favor, insira seu cargo.";
      if (!formData.industry) return "Selecione sua área de atuação.";
    }
    if (step === 2) {
      if (!formData.painPoint.trim())
        return "Descreva seu maior desafio profissional.";
      if (formData.painPoint.trim().length < 20)
        return "Descreva com mais detalhes (mínimo 20 caracteres).";
      if (!formData.frequency) return "Selecione a frequência.";
    }
    if (step === 3) {
      if (!formData.currentSolution.trim())
        return "Conte como você lida com esse problema hoje.";
      if (!formData.willingToPay)
        return "Selecione se pagaria por uma solução.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => s + 1);
  };

  const prevStep = () => {
    setError("");
    setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar resposta");
      }

      router.push("/obrigado");
    } catch {
      setError("Erro ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 flex items-center justify-center px-3 py-8 sm:px-4 sm:py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-5 sm:mb-8 animate-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs sm:text-sm mb-3">
            <span>🔍</span>
            <span>Pesquisa rápida — 2 min</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
            Dor de Mercado
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Compartilhe seus desafios profissionais e nos ajude a criar
            soluções que fazem a diferença.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="step-indicator">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`step-dot ${
                step === s.id ? "active" : step > s.id ? "completed" : ""
              }`}
            />
          ))}
        </div>

        {/* Form Card */}
        <div className="glass-card p-4 sm:p-8">
          <h2 className="text-lg font-semibold mb-1 text-white">
            {STEPS[step - 1].title}
          </h2>
          <p className="text-sm text-slate-400 mb-4 sm:mb-6">
            Etapa {step} de {STEPS.length}
          </p>

          {/* Step 1: About You */}
          {step === 1 && (
            <div className="space-y-3 sm:space-y-4 animate-in">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Cargo / Função
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: Product Manager, Desenvolvedor, CEO"
                  value={formData.role}
                  onChange={(e) => updateField("role", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Área de atuação
                </label>
                <select
                  className="input-field"
                  value={formData.industry}
                  onChange={(e) => updateField("industry", e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>
                      {ind}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Pain Points */}
          {step === 2 && (
            <div className="space-y-3 sm:space-y-4 animate-in">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Qual é o maior problema ou frustração que você enfrenta no seu
                  trabalho?
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Descreva com detalhes o que mais te incomoda, consome tempo ou energia no dia a dia profissional..."
                  value={formData.painPoint}
                  onChange={(e) => updateField("painPoint", e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  {formData.painPoint.length}/20 caracteres (mínimo)
                </p>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-3">
                  Com que frequência esse problema acontece?
                </label>
                <div className="space-y-2">
                  {FREQUENCIES.map((freq) => (
                    <label
                      key={freq.value}
                      className={`radio-option ${
                        formData.frequency === freq.value ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="frequency"
                        value={freq.value}
                        checked={formData.frequency === freq.value}
                        onChange={(e) =>
                          updateField("frequency", e.target.value)
                        }
                        className="sr-only"
                      />
                      <span className="text-lg">{freq.emoji}</span>
                      <span className="text-sm">{freq.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Solutions */}
          {step === 3 && (
            <div className="space-y-3 sm:space-y-4 animate-in">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Como você resolve (ou tenta resolver) esse problema hoje?
                </label>
                <textarea
                  className="input-field"
                  rows={3}
                  placeholder="Ex: Uso planilhas, faço manualmente, uso ferramenta X mas não gosto..."
                  value={formData.currentSolution}
                  onChange={(e) =>
                    updateField("currentSolution", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-3">
                  Você pagaria por uma solução que resolvesse esse problema?
                </label>
                <div className="space-y-2">
                  {WILLING_TO_PAY.map((opt) => (
                    <label
                      key={opt.value}
                      className={`radio-option ${
                        formData.willingToPay === opt.value ? "selected" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="willingToPay"
                        value={opt.value}
                        checked={formData.willingToPay === opt.value}
                        onChange={(e) =>
                          updateField("willingToPay", e.target.value)
                        }
                        className="sr-only"
                      />
                      <span className="text-lg">{opt.emoji}</span>
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Algo mais que queira compartilhar? (opcional)
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="Sugestões, ideias, frustrações..."
                  value={formData.additionalInfo}
                  onChange={(e) =>
                    updateField("additionalInfo", e.target.value)
                  }
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-5 sm:mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 transition-all text-sm font-medium"
              >
                Voltar
              </button>
            )}
            {step < STEPS.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Continuar
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Enviando...
                  </span>
                ) : (
                  "Enviar Respostas"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Suas respostas são confidenciais e serão usadas apenas para pesquisa.
        </p>
      </div>
    </main>
  );
}
