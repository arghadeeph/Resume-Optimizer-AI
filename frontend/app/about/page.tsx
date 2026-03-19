export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">About Resume Optimizer AI</h1>
      <p className="mt-4 text-slate-700">
        We help professionals improve recruiter visibility using resume scoring, AI rewrites, and keyword intelligence
        aligned with hiring trends.
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">AI Guidance</h2>
          <p className="mt-2 text-sm text-slate-600">Summary, experience, and improvement suggestions generated instantly.</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Recruiter Lens</h2>
          <p className="mt-2 text-sm text-slate-600">Scores mirror what hiring teams search and shortlist for.</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold">Keyword Strategy</h2>
          <p className="mt-2 text-sm text-slate-600">NLP extraction checks resume alignment with role-relevant terms.</p>
        </div>
      </div>
    </main>
  );
}
