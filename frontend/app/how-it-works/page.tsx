import Image from "next/image";

function StepIcon({ text }: { text: string }) {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
      {text}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">How It Works</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
          From resume upload to recruiter-ready improvements in minutes
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-slate-600">
          Our pipeline combines parsing, NLP, and AI rewriting to generate actionable suggestions and section-level scoring.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
          <Image
            src="/how-it-works-visual.svg"
            alt="How Resume Optimizer AI works"
            width={1400}
            height={700}
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Resumes Processed", value: "12.4K+", tone: "from-sky-100 to-blue-100 text-sky-700" },
          { label: "Avg Time", value: "8 sec", tone: "from-violet-100 to-fuchsia-100 text-violet-700" },
          { label: "Score Improvement", value: "+22%", tone: "from-emerald-100 to-teal-100 text-emerald-700" },
          { label: "User Satisfaction", value: "4.8/5", tone: "from-amber-100 to-orange-100 text-amber-700" }
        ].map((s) => (
          <article key={s.label} className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <div className={`inline-block rounded-xl bg-gradient-to-br px-3 py-1 text-xs font-semibold ${s.tone}`}>{s.label}</div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">{s.value}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        {[
          {
            title: "1. Extract",
            body: "We parse summary, experience, and skills from an uploaded resume.",
            step: "01"
          },
          {
            title: "2. Analyze",
            body: "NLP keyword matching and AI scoring evaluate recruiter relevance and resume strength.",
            step: "02"
          },
          {
            title: "3. Rewrite",
            body: "AI generates improved summary/experience plus concrete resume enhancement suggestions.",
            step: "03"
          },
          {
            title: "4. Deliver",
            body: "You get a full dashboard with section-level scores, total score, and recruiter feedback.",
            step: "04"
          }
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <StepIcon text={item.step} />
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            </div>
            <p className="mt-3 text-slate-600">{item.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
