import { render, screen } from "@testing-library/react";

import DashboardPage from "@/app/dashboard/page";

describe("DashboardPage", () => {
  it("renders stored analysis data", async () => {
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ name: "Test User", email: "test@example.com" })
    );
    localStorage.setItem(
      "analysis_result",
      JSON.stringify({
        score: 82,
        headline_score: 16,
        about_score: 17,
        experience_score: 20,
        skills_score: 13,
        keyword_score: 16,
        suggestions: ["Add cloud keywords", "Expand impact statements"],
        improved_headline: "Senior Engineer | Cloud APIs",
        improved_about: "I design distributed platforms",
        recruiter_feedback: "Good potential for senior backend roles",
        experience_level: "senior",
        industry: "software",
        role: "backend engineer",
        issues_summary: "Missing quantified impact.",
        improvements_summary: "Add metrics and tighten summary.",
        industry_keywords: ["microservices", "AWS"],
        section_feedback: {
          headline: { good: ["Clear title"], ok: ["Short"], needs_improvement: ["Add tech stack"] },
          about: { good: ["Readable"], ok: ["Generic"], needs_improvement: ["Add outcomes"] },
          experience: { good: ["Relevant roles"], ok: ["Short bullets"], needs_improvement: ["Quantify impact"] },
          skills: { good: ["Core stack"], ok: ["Missing cloud"], needs_improvement: ["Add AWS"] },
          keywords: { good: ["Some matches"], ok: ["Low density"], needs_improvement: ["Add role keywords"] }
        }
      })
    );

    render(<DashboardPage />);

    expect(await screen.findByText(/resume analysis dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/senior engineer \| cloud apis/i)).toBeInTheDocument();
    expect(screen.getByText(/add cloud keywords/i)).toBeInTheDocument();
  });
});
