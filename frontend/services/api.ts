import { AnalysisResponse } from "@/utils/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function analyzeResume(file: File, signal?: AbortSignal): Promise<AnalysisResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE}/analyze-resume`, {
    method: "POST",
    body: formData,
    signal
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = payload?.detail || "Failed to analyze resume";
    throw new Error(detail);
  }

  return response.json();
}
