export class StatusStyle {
  static orderStatus(status: string): string {
    return status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_')
  }
}
