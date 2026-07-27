import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function confidenceColor(score: number): string {
  if (score >= 0.9) return "#22C55E"
  if (score >= 0.75) return "#FBBF24"
  return "#F87171"
}

export function confidencePercent(score: number): number {
  return Math.round(score * 100)
}

// Some commit messages (e.g. auto-generated Dependabot PR bodies) can be thousands of
// characters of raw HTML/markdown - cap anything going into an LLM prompt or a citation display.
export function truncateText(text: string, maxLength = 500): string {
  if (!text) return text
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}
