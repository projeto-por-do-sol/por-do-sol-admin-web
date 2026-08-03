export class StatusStyle {
  static orderStatus(status: string): string {
    status = status.toLowerCase()
    if (status != 'em preparo') {
      return status
    }
    return 'em_preparo'
  }
}
