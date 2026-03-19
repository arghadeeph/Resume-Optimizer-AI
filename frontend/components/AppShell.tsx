"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { clearAuthUser, getAuthUser, type AuthUser } from "@/utils/auth";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-ink">
            Resume Optimizer AI
          </Link>
          <div className="flex items-center gap-5 text-sm font-medium text-slate-600">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
            {user ? (
              <>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">{user.name}</span>
                <button
                  onClick={() => {
                    clearAuthUser();
                    setUser(null);
                  }}
                  className="rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="rounded-md bg-ink px-3 py-1.5 text-xs text-white">
                Login
              </Link>
            )}
          </div>
        </nav>
      </header>

      {children}

      <footer className="mt-16 border-t border-slate-200 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
          <p>Resume Optimizer AI</p>
          <div className="flex items-center gap-4">
            <Link href="/about">About</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
