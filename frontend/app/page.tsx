"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { analyzeResume } from "@/services/api";

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v6c0 5-3.5 7.8-7 9-3.5-1.2-7-4-7-9V6l7-3z" />
      <path d="M9.5 12.3l1.9 1.9 3.3-3.4" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l1.5 4.2L18 9l-4.5 1.8L12 15l-1.5-4.2L6 9l4.5-1.8L12 3z" />
      <path d="M18.5 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19h16" />
      <path d="M7 16V9" />
      <path d="M12 16V6" />
      <path d="M17 16v-4" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M13 2L5 13h5l-1 9 8-11h-5l1-9z" />
    </svg>
  );
}

type FormCardProps = {
  file: File | null;
  setFile: (value: File | null) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: FormEvent) => Promise<void>;
  compact?: boolean;
};

function AnalysisForm({ file, setFile, loading, error, onSubmit, compact = false }: FormCardProps) {
  const [dragActive, setDragActive] = useState(false);

  return (
    <form
      onSubmit={onSubmit}
      className="animate-glow rounded-3xl border border-sky-200/80 bg-gradient-to-b from-white via-sky-50/20 to-violet-50/20 p-6 shadow-2xl md:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Start Analysis</p>
      <label htmlFor={compact ? "resume-file-mobile" : "resume-file"} className="mt-3 block text-base font-semibold text-slate-800">
        Upload Resume
      </label>
      <label
        htmlFor={compact ? "resume-file-mobile" : "resume-file"}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) setFile(dropped);
        }}
        className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-5 py-6 text-center transition ${
          dragActive ? "border-sky-400 bg-sky-50/60" : "border-slate-300 bg-white"
        }`}
      >
        <div className="rounded-2xl bg-slate-900 p-3 text-white">
          <SparkIcon />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">Drag & drop your resume</p>
          <p className="mt-1 text-xs text-slate-500">PDF, DOCX, or TXT • Max 5 MB recommended</p>
        </div>
        <span className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700">
          Choose file
        </span>
        <input
          id={compact ? "resume-file-mobile" : "resume-file"}
          type="file"
          accept=".pdf,.docx,.txt"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
      </label>
      {file ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs text-slate-600">
          <span className="truncate font-medium text-slate-800">{file.name}</span>
          <button
            type="button"
            className="text-slate-500 hover:text-slate-700"
            onClick={() => setFile(null)}
          >
            Remove
          </button>
        </div>
      ) : null}
      <button
        type="submit"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-4 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50"
        disabled={loading}
      >
        <BoltIcon />
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </form>
  );
}

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    let timeoutId: number | null = null;

    try {
      if (!file) {
        setError("Please upload a resume file.");
        return;
      }
      const controller = new AbortController();
      timeoutId = window.setTimeout(() => controller.abort(), 60000);
      const result = await analyzeResume(file, controller.signal);
      localStorage.setItem("analysis_result", JSON.stringify(result));
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error && err.name === "AbortError"
          ? "Resume analysis timed out. Please try a smaller file."
          : err instanceof Error
          ? err.message
          : "Could not analyze this resume.";
      setError(message);
    } finally {
      if (timeoutId) window.clearTimeout(timeoutId);
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8 lg:py-10">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_30rem] lg:gap-8">
        <section className="space-y-6">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/70 p-8 shadow-xl backdrop-blur-xl md:p-10 min-h-[26rem] lg:min-h-[28rem]">
            <div className="hero-orb one" />
            <div className="hero-orb two" />
            <div className="hero-orb three" />

            <div className="relative z-10 animate-fade-up">
              <p className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600">
                <SparkIcon />
                Built for modern job seekers
              </p>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.018em] text-slate-900 md:text-6xl">
                Upgrade your resume with recruiter-grade AI insights.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-slate-600 md:text-xl">
                Upload a resume and get a clear score, actionable fixes, and rewritten sections that improve recruiter
                visibility.
              </p>
              <div className="mt-8 lg:hidden">
                <AnalysisForm file={file} setFile={setFile} loading={loading} error={error} onSubmit={handleSubmit} compact />
              </div>
            </div>
          </div>

          <section className="grid min-h-[20vh] gap-4 md:grid-cols-3">
            {[
              {
                label: "AI Powered",
                desc: "LLM-based rewriting and scoring.",
                icon: <SparkIcon />,
                tone: "from-cyan-400 to-blue-500"
              },
              {
                label: "Secure",
                desc: "Sanitized input and safe request handling.",
                icon: <ShieldIcon />,
                tone: "from-emerald-400 to-teal-500"
              },
              {
                label: "Free to Start",
                desc: "Run instant resume analysis with no paywall.",
                icon: <BoltIcon />,
                tone: "from-fuchsia-400 to-violet-500"
              }
            ].map((item) => (
              <article
                key={item.label}
                className="group flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 text-white ${item.tone}`}>
                  {item.icon}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-slate-900">{item.label}</h2>
                <p className="mt-1 text-sm text-slate-600">{item.desc}</p>
              </article>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            {[
              {
                label: "Resumes Analyzed",
                value: "12,400+",
                icon: <ChartIcon />,
                tone: "from-blue-100 to-indigo-100 text-blue-700"
              },
              {
                label: "Average Score Lift",
                value: "+22%",
                icon: <SparkIcon />,
                tone: "from-pink-100 to-fuchsia-100 text-fuchsia-700"
              },
              {
                label: "Response Time",
                value: "<10 sec",
                icon: <BoltIcon />,
                tone: "from-amber-100 to-orange-100 text-orange-700"
              },
              {
                label: "Keyword Fit",
                value: "Role-aligned",
                icon: <ShieldIcon />,
                tone: "from-emerald-100 to-teal-100 text-emerald-700"
              }
            ].map((item) => (
              <article
                key={item.label}
                className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition duration-300 hover:shadow-lg"
              >
                <div className={`inline-flex rounded-2xl bg-gradient-to-br p-3 ${item.tone}`}>{item.icon}</div>
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-3xl font-semibold text-slate-900">{item.value}</p>
              </article>
            ))}
          </section>
        </section>

        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <AnalysisForm file={file} setFile={setFile} loading={loading} error={error} onSubmit={handleSubmit} />
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Live Platform Stats</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-sky-50 p-3 text-center">
                  <p className="text-2xl font-semibold text-sky-700">10K+</p>
                  <p className="text-xs font-medium text-slate-600">Resumes analyzed</p>
                </div>
                <div className="rounded-2xl bg-emerald-50 p-3 text-center">
                  <p className="text-2xl font-semibold text-emerald-700">200+</p>
                  <p className="text-xs font-medium text-slate-600">Got employed</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/how-it-works" className="rounded-xl border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-700">
                  How it works
                </Link>
                <Link href="/samples" className="rounded-xl bg-slate-900 px-3 py-2 text-center text-sm font-semibold text-white">
                  View sample
                </Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
