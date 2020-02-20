const timezone = 8
const timezoneOffset = timezone * 60 * 60 * 1000

const fillZero = num => {
  if (num < 10) return `0${num}`
  return num
}

const numToTimeFormat = _num => {
  if (_num === 0) return '00:00'

  if (!_num) return ''

  const num = Math.floor(_num)
  const min = Math.floor(num / 60)
  const sec = num - min * 60
  return `${fillZero(min)}:${fillZero(sec)}`
}

const timestampToDateFormat = (timestamp, isIncludedTime) => {
  const _d = new Date(new Date(timestamp).valueOf() + timezoneOffset)

  const month = _d.getUTCMonth() + 1
  const day = _d.getUTCDate()
  const year = _d.getUTCFullYear()
  const hour = _d.getUTCHours()
  const min = _d.getUTCMinutes()

  if (isIncludedTime) return `${year}/${month}/${day} ${fillZero(hour)}:${fillZero(min)}`

  return `${year}/${month}/${day}`
}

const easyReadDateFormat = _timestamp => {
  if (!_timestamp) return ''

  const timestamp = Math.floor(_timestamp / 1000)
  const SECS_IN_MINUTE = 60
  const SECS_IN_HOUR = 60 * 60
  const SECS_IN_DAY = 60 * 60 * 24
  const SECS_IN_MONTH = 60 * 60 * 24 * 2 // max 2 days
  const nowInSec = Math.floor(Date.now() / 1000)
  const timeAdv = nowInSec - timestamp < 0 ? '後' : '前'
  const diff = Math.abs(nowInSec - timestamp)

  if (diff < SECS_IN_MINUTE) {
    // within one minute => xx 秒 (前 | 後)
    return `${diff} 秒${timeAdv}`
  } else if (diff < SECS_IN_HOUR) {
    // within one hour => xx 分鐘 (前 | 後)
    return `${Math.floor(diff / SECS_IN_MINUTE)} 分鐘${timeAdv}`
  } else if (diff < SECS_IN_DAY) {
    // within one day => xx 小時 (前 | 後)
    return `${Math.floor(diff / SECS_IN_HOUR)} 小時${timeAdv}`
  } else if (diff < SECS_IN_MONTH) {
    // within one month => xx 天 (前 | 後)
    return `${Math.floor(diff / SECS_IN_DAY)} 天${timeAdv}`
  }

  return timestampToDateFormat(_timestamp)
}


export default { numToTimeFormat, timestampToDateFormat, easyReadDateFormat }
