import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import HomePage from "@/app/page";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock })
}));

jest.mock("@/services/api", () => ({
  analyzeResume: jest.fn()
}));

const { analyzeResume } = jest.requireMock("@/services/api");

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem(
      "auth_user",
      JSON.stringify({ name: "Test User", email: "test@example.com" })
    );
    pushMock.mockReset();
  });

  it("submits resume and navigates to dashboard", async () => {
    analyzeResume.mockResolvedValueOnce({
      score: 90,
      headline_score: 18,
      about_score: 18,
      experience_score: 22,
      skills_score: 14,
      keyword_score: 18,
      suggestions: ["Add metrics"],
      improved_headline: "New headline",
      improved_about: "New about",
      recruiter_feedback: "Strong resume"
    });

    render(<HomePage />);

    const file = new File(["Resume content"], "resume.txt", { type: "text/plain" });
    fireEvent.change(screen.getAllByLabelText(/upload resume/i)[0], {
      target: { files: [file] }
    });
    fireEvent.click(screen.getAllByRole("button", { name: /analyze resume/i })[0]);

    await waitFor(() => {
      expect(analyzeResume).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});
