import Image from "next/image";

function ScoreBadge({ label, score, tone }: { label: string; score: string; tone: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <div className={`inline-block rounded-xl bg-gradient-to-br px-3 py-1 text-xs font-semibold ${tone}`}>{label}</div>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{score}</p>
    </div>
  );
}

export default function SamplesPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">View Samples</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          Example analysis output and recommendation style
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          See the level of detail users receive, from score breakdowns to rewritten summary sections.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src="/sample-report.svg"
            alt="Sample resume analysis report"
            width={1400}
            height={780}
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-5">
        <ScoreBadge label="Total" score="86/100" tone="from-sky-100 to-blue-100 text-sky-700" />
        <ScoreBadge label="Headline" score="17/20" tone="from-indigo-100 to-violet-100 text-indigo-700" />
        <ScoreBadge label="Summary" score="18/20" tone="from-fuchsia-100 to-pink-100 text-fuchsia-700" />
        <ScoreBadge label="Experience" score="22/25" tone="from-emerald-100 to-teal-100 text-emerald-700" />
        <ScoreBadge label="Keywords" score="16/20" tone="from-amber-100 to-orange-100 text-amber-700" />
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Improved Headline</h2>
          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-slate-700">
            Senior Software Engineer | FastAPI | Distributed Systems | Cloud Platform
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">Recruiter Feedback Sample</h2>
          <p className="mt-3 rounded-xl bg-slate-50 p-4 text-slate-700">
            Strong backend resume with solid system design and API delivery skills. Improve quantified outcomes and
            cloud keywords to increase shortlist probability.
          </p>
        </article>
      </section>
    </main>
  );
}
