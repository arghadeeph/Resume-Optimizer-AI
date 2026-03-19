"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { loginUser, registerUser } from "@/utils/auth";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage("");

    if (mode === "register") {
      const result = registerUser(name.trim() || "User", email.trim(), password);
      if (!result.ok) {
        setMessage(result.message || "Could not create account.");
        return;
      }
      router.push("/");
      return;
    }

    const result = loginUser(email.trim(), password);
    if (!result.ok) {
      setMessage(result.message || "Could not login.");
      return;
    }
    router.push("/");
  }

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-2xl font-bold">{mode === "login" ? "Login" : "Create Account"}</h1>
        <p className="mt-2 text-sm text-slate-600">Access resume analysis history and dashboard tools.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          {mode === "register" ? (
            <input
              className="w-full rounded-lg border border-slate-300 px-4 py-3"
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          ) : null}
          <input
            type="email"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-lg border border-slate-300 px-4 py-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full rounded-lg bg-ink px-4 py-3 font-semibold text-white" type="submit">
            {mode === "login" ? "Login" : "Create Account"}
          </button>
        </form>

        {message ? <p className="mt-3 text-sm text-red-600">{message}</p> : null}

        <button
          onClick={() => setMode(mode === "login" ? "register" : "login")}
          className="mt-4 text-sm text-ocean"
        >
          {mode === "login" ? "Need an account? Register" : "Have an account? Login"}
        </button>
      </div>
    </main>
  );
}
