"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { analyzeProfile } from "@/services/api";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await analyzeProfile(url);
      localStorage.setItem("analysis_result", JSON.stringify(result));
      router.push("/dashboard");
    } catch {
      setError("Could not analyze this profile. Check URL and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-20">
      <h1 className="text-4xl font-extrabold tracking-tight">LinkedIn AI Profile Optimizer</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Paste your LinkedIn public profile URL to get recruiter-focused scoring and rewrites.
      </p>
      <form onSubmit={handleSubmit} className="mt-10 space-y-4 rounded-2xl bg-white p-6 shadow-md">
        <label htmlFor="profile-url" className="block text-sm font-medium text-slate-700">
          LinkedIn Profile URL
        </label>
        <input
          id="profile-url"
          type="url"
          className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-ocean"
          placeholder="https://www.linkedin.com/in/your-name"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-ink px-4 py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Profile"}
        </button>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
      </form>
    </main>
  );
}
