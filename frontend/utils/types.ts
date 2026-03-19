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
  experience_level: string;
  industry: string;
  role: string;
  issues_summary: string;
  improvements_summary: string;
  industry_keywords: string[];
  section_feedback: {
    headline: { good: string[]; ok: string[]; needs_improvement: string[] };
    about: { good: string[]; ok: string[]; needs_improvement: string[] };
    experience: { good: string[]; ok: string[]; needs_improvement: string[] };
    skills: { good: string[]; ok: string[]; needs_improvement: string[] };
    keywords: { good: string[]; ok: string[]; needs_improvement: string[] };
  };
};
