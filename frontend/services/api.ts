import { AnalysisResponse } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function analyzeProfile(profileUrl: string): Promise<AnalysisResponse> {
  const response = await fetch(`${API_BASE}/analyze-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile_url: profileUrl.trim() })
  });

  if (!response.ok) {
    throw new Error("Failed to analyze profile");
  }

  return response.json();
}
