"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ApiError, login, register } from "@/lib/api";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
};

const COPY: Record<Mode, { title: string; subtitle: string; submitLabel: string }> = {
  login: {
    title: "Entrar",
    subtitle: "Acede à tua conta para veres o tempo em qualquer lugar.",
    submitLabel: "Entrar",
  },
  register: {
    title: "Criar conta",
    subtitle: "Regista-te para guardares favoritos, histórico e preferências.",
    submitLabel: "Criar conta",
  },
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const copy = COPY[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof ApiError ? error.message : "Não foi possível concluir o pedido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-50">{copy.title}</h1>
        <p className="mt-1 text-sm text-slate-400">{copy.subtitle}</p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-slate-300">
        Email
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-slate-300">
        Palavra-passe
        <input
          type="password"
          required
          minLength={mode === "register" ? 8 : undefined}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-slate-100 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
        />
      </label>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-sky-400 px-4 py-2.5 font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "A processar…" : copy.submitLabel}
      </button>

      <p className="text-center text-sm text-slate-400">
        {mode === "login" ? (
          <>
            Ainda não tens conta?{" "}
            <a href="/register" className="text-sky-400 hover:underline">
              Cria uma
            </a>
          </>
        ) : (
          <>
            Já tens conta?{" "}
            <a href="/login" className="text-sky-400 hover:underline">
              Entra
            </a>
          </>
        )}
      </p>
    </form>
  );
}
