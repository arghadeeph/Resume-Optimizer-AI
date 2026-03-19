"use client";

import { useEffect, useState } from "react";

import ScoreCard from "@/components/ScoreCard";
import ScoreRing from "@/components/ScoreRing";
import { AnalysisResponse } from "@/utils/types";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 10v6" />
      <path d="M12 7h.01" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 6l12 12" />
      <path d="M18 6l-12 12" />
    </svg>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalysisResponse | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem("analysis_result");
    if (!raw) return;
    setData(JSON.parse(raw));
  }, []);

  if (!data) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl px-6 py-20">
        <p className="text-slate-600">No analysis found. Upload a resume from the homepage.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Resume Analysis Dashboard</h1>
        <p className="mt-2 text-slate-600">Your recruiter attractiveness score and optimization tips.</p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Experience Level</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{data.experience_level || "Not detected"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Industry</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{data.industry || "Not detected"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Target Role</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{data.role || "Not detected"}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ScoreRing score={data.score} />
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ScoreCard title="Headline" score={data.headline_score} max={20} />
            <ScoreCard title="Summary" score={data.about_score} max={20} />
            <ScoreCard title="Experience" score={data.experience_score} max={25} />
            <ScoreCard title="Skills" score={data.skills_score} max={15} />
            <ScoreCard title="Keywords" score={data.keyword_score} max={20} />
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Summary Of Issues</h2>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">{data.issues_summary}</p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Summary Of Improvements</h2>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">{data.improvements_summary}</p>
        </article>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Improved Headline</h2>
          <p className="mt-3 text-slate-700">{data.improved_headline}</p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Improved Summary</h2>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">{data.improved_about}</p>
        </article>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Industry Keywords</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {data.industry_keywords?.length
            ? data.industry_keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {keyword}
                </span>
              ))
            : <p className="text-slate-600">No keywords detected.</p>}
        </div>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        {[
          { key: "headline", label: "Headline" },
          { key: "about", label: "Summary" },
          { key: "experience", label: "Experience" },
          { key: "skills", label: "Skills" },
          { key: "keywords", label: "Keywords" }
        ].map((section) => {
          const feedback = data.section_feedback?.[section.key as keyof typeof data.section_feedback];
          return (
            <details key={section.key} className="rounded-2xl bg-white p-6 shadow-md">
              <summary className="flex cursor-pointer items-center justify-between text-xl font-semibold text-slate-900">
                <span>{section.label} Feedback</span>
                <span className="text-sm font-medium text-slate-500">Tap to expand</span>
              </summary>
              <div className="mt-5 grid gap-4">
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckIcon />
                    <p className="text-sm font-semibold uppercase tracking-wide">What’s Good</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-emerald-900">
                    {(feedback?.good || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <InfoIcon />
                    <p className="text-sm font-semibold uppercase tracking-wide">What’s OK</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-amber-900">
                    {(feedback?.ok || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-4">
                  <div className="flex items-center gap-2 text-rose-700">
                    <CrossIcon />
                    <p className="text-sm font-semibold uppercase tracking-wide">Needs Improvement</p>
                  </div>
                  <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-rose-900">
                    {(feedback?.needs_improvement || []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          );
        })}
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">AI Suggestions</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          {data.suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Action Plan</h2>
        <p className="mt-2 text-sm text-slate-600">
          Priority improvements combined across all sections.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          {(() => {
            const items = [
              ...(data.section_feedback?.headline?.needs_improvement || []),
              ...(data.section_feedback?.about?.needs_improvement || []),
              ...(data.section_feedback?.experience?.needs_improvement || []),
              ...(data.section_feedback?.skills?.needs_improvement || []),
              ...(data.section_feedback?.keywords?.needs_improvement || [])
            ];
            const unique = Array.from(new Set(items)).slice(0, 8);
            return unique.length
              ? unique.map((item) => <li key={item}>{item}</li>)
              : [<li key="none">No critical issues detected.</li>];
          })()}
        </ul>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-md">
        <h2 className="text-xl font-semibold">Recruiter Feedback</h2>
        <p className="mt-3 text-slate-700">{data.recruiter_feedback}</p>
      </section>
    </main>
  );
}
