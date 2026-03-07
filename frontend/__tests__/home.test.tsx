import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import HomePage from "@/app/page";

const pushMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock })
}));

jest.mock("@/services/api", () => ({
  analyzeProfile: jest.fn()
}));

const { analyzeProfile } = jest.requireMock("@/services/api");

describe("HomePage", () => {
  beforeEach(() => {
    localStorage.clear();
    pushMock.mockReset();
  });

  it("submits URL and navigates to dashboard", async () => {
    analyzeProfile.mockResolvedValueOnce({
      score: 90,
      headline_score: 18,
      about_score: 18,
      experience_score: 22,
      skills_score: 14,
      keyword_score: 18,
      suggestions: ["Add metrics"],
      improved_headline: "New headline",
      improved_about: "New about",
      recruiter_feedback: "Strong profile"
    });

    render(<HomePage />);

    fireEvent.change(screen.getByLabelText(/linkedin profile url/i), {
      target: { value: "https://www.linkedin.com/in/jane-doe" }
    });
    fireEvent.click(screen.getByRole("button", { name: /analyze profile/i }));

    await waitFor(() => {
      expect(analyzeProfile).toHaveBeenCalled();
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});
