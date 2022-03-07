
export function in_array(str, arr) {
  let in_ = false
  arr.forEach(a => {
    if (a === str) {
      in_ = true
    }
  })
  return in_
}
