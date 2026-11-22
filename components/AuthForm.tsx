"use client";

import { useState } from "react";
import { Cross } from "@/components/Icon";

export function AuthForm({ mode, nextPath }: { mode: "sign-in" | "sign-up"; nextPath: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const signIn = mode === "sign-in";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch(signIn ? "/api/auth/sign-in" : "/api/auth/sign-up", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.error === "string" ? data.error : "Couldn't continue.");
      setPending(false);
      return;
    }
    location.href = nextPath;
  }

  const other = signIn ? "/sign-up" : "/sign-in";
  const otherHref = `${other}?next=${encodeURIComponent(nextPath)}`;

  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <a className="brand" href="/">
          <Cross className="icon-inline" /> Emergy
        </a>
        <h1>{signIn ? "Sign in" : "Create an account"}</h1>
        <p className="field-help">
          Save cards to your account and open them when you want to print again. A helper still reads the QR code, not your account.
        </p>
        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="field">
          <span className="field-label">Password</span>
          <input
            type="password"
            autoComplete={signIn ? "current-password" : "new-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
        </label>
        {error && (
          <p className="field-help error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" type="submit" disabled={pending}>
          {signIn ? "Sign in" : "Create account"}
        </button>
        <p className="field-help">
          {signIn ? "New here? " : "Already have an account? "}
          <a className="link" href={otherHref}>
            {signIn ? "Create an account" : "Sign in"}
          </a>
        </p>
      </form>
    </main>
  );
}
