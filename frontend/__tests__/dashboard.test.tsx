import { render, screen } from "@testing-library/react";

import DashboardPage from "@/app/dashboard/page";

describe("DashboardPage", () => {
  it("renders stored analysis data", async () => {
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
        recruiter_feedback: "Good potential for senior backend roles"
      })
    );

    render(<DashboardPage />);

    expect(await screen.findByText(/profile analysis dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/senior engineer \| cloud apis/i)).toBeInTheDocument();
    expect(screen.getByText(/add cloud keywords/i)).toBeInTheDocument();
  });
});
