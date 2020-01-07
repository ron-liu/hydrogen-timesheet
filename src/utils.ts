export const createTime = (hours: number, minutes: number = 0): Date =>
  new Date((hours * 60 + minutes) * 1000 * 60)
