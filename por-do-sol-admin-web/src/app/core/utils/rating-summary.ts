export const RATING_VALUES = [5, 4, 3, 2, 1] as const

export interface RatingSummary {
  total: number
  average: number
  counts: Record<number, number>
}

export function summarizeRatings(ratings: number[]): RatingSummary {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  let sum = 0
  let total = 0

  for (const rating of ratings) {
    if (!(rating in counts)) continue
    counts[rating]++
    sum += rating
    total++
  }

  return { total, average: total ? sum / total : 0, counts }
}
