export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <div className="mt-6 space-y-4 text-slate-700">
        <p>We only process the uploaded resume text needed for analysis.</p>
        <p>Account data in this demo is stored in browser local storage for sign-in simulation.</p>
        <p>For production, move authentication and storage to secure server-side systems.</p>
      </div>
    </main>
  );
}
