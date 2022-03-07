export function randomSort(a, b) {
  return Math.random() > 0.5 ? -1 : 1;
}

export function randomSortArray(arr) {
  arr.sort(randomSort)
  return arr
}


/**
 * unique array
 * @param arr
 * @returns {any[]}
 */
export function unique(arr) {
  return Array.from(new Set(arr))
}


/**
 * unique array
 * @param arr
 * @returns {any[]}
 */
export function unique_array(arr) {
  return Array.from(new Set(arr))
}
