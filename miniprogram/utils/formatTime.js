


export function formatTime(date) {
  const d = new Date(date)
  let y = d.getFullYear()
  let m = d.getMonth()+1
  let _d = d.getDate()
  let h = d.getHours()
  let _m = d.getMinutes()
  let s = d.getSeconds()

  m = m<10?`0${m}`:m
  _d = _d < 10 ? `0${_d}` : _d
  h = h < 10 ? `0${h}` : h
  _m = _m < 10 ? `0${_m}` : _m
  s = s < 10 ? `0${s}` : s
  return `${y}-${m}-${_d} ${h}:${_m}:${s}`
}