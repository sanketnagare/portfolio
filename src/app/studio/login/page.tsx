"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setPassword("");
        return;
      }

      const next = searchParams.get("next") ?? "/studio";
      router.push(next.startsWith("/studio") ? next : "/studio");
      router.refresh();
    } catch {
      setError("Network error. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <h1 className="font-heading text-lg font-semibold mb-1">Studio</h1>
        <p className="text-xs text-foreground/50 mb-6">
          Enter your password to continue.
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          autoComplete="current-password"
          placeholder="Password"
          className="w-full px-3 py-2 text-sm bg-surface border border-border rounded
                     focus:outline-none focus:border-accent transition-colors"
        />

        {error && <p className="mt-3 text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-4 w-full px-3 py-2 text-sm font-medium rounded bg-accent text-white
                     hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors"
        >
          {busy ? "Checking..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
