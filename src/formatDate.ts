export default function formatDate(formatValue: string, date: Date = new Date()) {
  let result = ''
  
  let char: string = ''
  let pos: number = -1
  function advance() {
    pos += 1
    char = formatValue[pos]
  }

  advance()

  const _l: number = date.getMilliseconds()
  const _s: number = date.getSeconds()
  const _M: number = date.getMinutes()
  const _h: number = date.getHours()
  const _d: number = date.getDate()
  const _m: number = date.getMonth() + 1
  
  const year: string = String(date.getFullYear())
  const month: string = _m < 10 ? '0' + String(_m) : String(_m)
  const day: string = _d < 10 ? '0' + String(_d) : String(_d)
  const hour: string = _h < 10 ? '0' + String(_h) : String(_h)
  const minute: string = _M < 10 ? '0' + String(_M) : String(_M)
  const second: string = _s < 10 ? '0' + String(_s) : String(_s)
  const milesecond: string = _l < 10 ? '00' + String(_l) : _l < 100 ? '0' + String(_l) : String(_l)

  while (char) {
    let parsed: boolean = false

    if (`${char}` == '%') {
      parsed = true

      advance()

      if (char == 'Y') {
        result += year
      }
      else if (char == 'y') {
        result += year.slice(2, 3)
      }
      else if (char == 'm') {
        result += month
      }
      else if (char == 'd') {
        result += day
      }
      else if (char == 'H') {
        result += hour
      }
      else if (char == 'M') {
        result += minute
      }
      else if (char == 'S') {
        result += second
      }
      else if (char == 'l') {
        result += milesecond
      }
      else {
        parsed = false
      }
    }

    if (!parsed) {
      result += char
    }

    advance()
  }

  return result
}

