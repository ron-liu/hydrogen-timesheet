export const createTime = (hours: number, minutes: number = 0): Date =>
  new Date((hours * 60 + minutes) * 1000 * 60)

export const createDate = (y: number, m: number, d: number): Date =>
  new Date(Date.UTC(y, m - 1, d))
