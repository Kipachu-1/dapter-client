const UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
  ['second', 1000],
]

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function timeAgo(iso: string): string {
  const date = new Date(iso).getTime()
  if (Number.isNaN(date)) return ''
  const diff = date - Date.now()
  for (const [unit, ms] of UNITS) {
    if (Math.abs(diff) >= ms || unit === 'second') {
      return rtf.format(Math.round(diff / ms), unit)
    }
  }
  return ''
}
