"use client";

import { useEffect, useState } from "react";

import ScoreCard from "@/components/ScoreCard";
import ScoreRing from "@/components/ScoreRing";
import { AnalysisResponse } from "@/utils/types";

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
        <p className="text-slate-600">No analysis found. Submit a profile from the homepage.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-md">
        <h1 className="text-3xl font-bold">Profile Analysis Dashboard</h1>
        <p className="mt-2 text-slate-600">Your recruiter attractiveness score and optimization tips.</p>

        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <ScoreRing score={data.score} />
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ScoreCard title="Headline" score={data.headline_score} max={20} />
            <ScoreCard title="About" score={data.about_score} max={20} />
            <ScoreCard title="Experience" score={data.experience_score} max={25} />
            <ScoreCard title="Skills" score={data.skills_score} max={15} />
            <ScoreCard title="Keywords" score={data.keyword_score} max={20} />
          </div>
        </div>
      </div>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Improved Headline</h2>
          <p className="mt-3 text-slate-700">{data.improved_headline}</p>
        </article>
        <article className="rounded-2xl bg-white p-6 shadow-md">
          <h2 className="text-xl font-semibold">Improved About</h2>
          <p className="mt-3 whitespace-pre-wrap text-slate-700">{data.improved_about}</p>
        </article>
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
        <h2 className="text-xl font-semibold">Recruiter Feedback</h2>
        <p className="mt-3 text-slate-700">{data.recruiter_feedback}</p>
      </section>
    </main>
  );
}
