import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-surface via-surface-raised to-surface px-4 py-16">
      <AuthForm mode="login" />
    </div>
  );
}
