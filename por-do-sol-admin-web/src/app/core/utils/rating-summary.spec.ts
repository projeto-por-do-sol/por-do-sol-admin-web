import { summarizeRatings } from './rating-summary';

describe('summarizeRatings', () => {
  it('counts how many reviews each rating received', () => {
    const summary = summarizeRatings([5, 5, 4, 1, 5])

    expect(summary.total).toBe(5)
    expect(summary.counts).toEqual({ 1: 1, 2: 0, 3: 0, 4: 1, 5: 3 })
  })

  it('averages the ratings', () => {
    expect(summarizeRatings([5, 4, 3]).average).toBe(4)
  })

  it('ignores ratings outside 1 to 5', () => {
    const summary = summarizeRatings([5, 0, 6, 2.5])

    expect(summary.total).toBe(1)
    expect(summary.average).toBe(5)
  })

  it('returns zeros when there are no reviews', () => {
    expect(summarizeRatings([])).toEqual({ total: 0, average: 0, counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } })
  })
})
