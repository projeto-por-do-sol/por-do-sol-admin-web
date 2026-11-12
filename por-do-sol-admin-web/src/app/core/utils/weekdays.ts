// A API usa 7 booleanos começando no domingo: [dom, seg, ter, qua, qui, sex, sáb].
const API_ORDER = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function weekdayName(dayIndex: number): string {
  return API_ORDER[((dayIndex % 7) + 7) % 7]
}

export function toWeekFlags(days: string[] = []): boolean[] {
  return API_ORDER.map(day => days.includes(day))
}

export function fromWeekFlags(flags: boolean[] | null | undefined): string[] {
  return API_ORDER.filter((_, index) => flags?.[index])
}
