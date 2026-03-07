export type AnalysisResponse = {
  score: number;
  headline_score: number;
  about_score: number;
  experience_score: number;
  skills_score: number;
  keyword_score: number;
  suggestions: string[];
  improved_headline: string;
  improved_about: string;
  recruiter_feedback: string;
};
