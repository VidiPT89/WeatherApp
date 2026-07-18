"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { translateApiError } from "@/i18n/errorMessage";
import { useTranslations } from "@/i18n/LocaleProvider";
import { ApiError, login, register } from "@/lib/api";

type Mode = "login" | "register";

type Props = {
  mode: Mode;
};

const MIN_PASSWORD_LENGTH = 8;

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const { dict } = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const copy =
    mode === "login"
      ? { title: dict.auth.loginTitle, subtitle: dict.auth.loginSubtitle, submitLabel: dict.auth.loginSubmit }
      : { title: dict.auth.registerTitle, subtitle: dict.auth.registerSubtitle, submitLabel: dict.auth.registerSubmit };

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
      setErrorMessage(error instanceof ApiError ? translateApiError(dict, error, dict.auth.genericError) : dict.auth.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm flex-col gap-5"
    >
      <div>
        <h1 className="text-2xl font-semibold text-text">{copy.title}</h1>
        <p className="mt-1 text-sm text-text-muted">{copy.subtitle}</p>
      </div>

      <label className="flex flex-col gap-1.5 text-sm text-text-muted">
        {dict.auth.email}
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-text outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </label>

      <label className="flex flex-col gap-1.5 text-sm text-text-muted">
        {dict.auth.password}
        <input
          type="password"
          required
          minLength={mode === "register" ? MIN_PASSWORD_LENGTH : undefined}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-lg border border-border bg-surface-raised px-3 py-2 text-text outline-none transition focus:border-accent focus:ring-1 focus:ring-accent"
        />
      </label>

      {errorMessage && (
        <p role="alert" className="rounded-lg bg-danger-bg px-3 py-2 text-sm text-danger">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-lg bg-accent px-4 py-2.5 font-medium text-accent-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? dict.auth.processing : copy.submitLabel}
      </button>

      <p className="text-center text-sm text-text-muted">
        {mode === "login" ? (
          <>
            {dict.auth.noAccount}{" "}
            <a href="/register" className="text-accent hover:underline">
              {dict.auth.createOne}
            </a>
          </>
        ) : (
          <>
            {dict.auth.hasAccount}{" "}
            <a href="/login" className="text-accent hover:underline">
              {dict.auth.signIn}
            </a>
          </>
        )}
      </p>
    </motion.form>
  );
}
