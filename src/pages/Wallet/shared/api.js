export const Api = (path) => {
  const t = window.__BASE_API.split("|")
  const baseApi = t[0] === "{{BASE_API}}" ? t[1] : t[0]
  return baseApi + path
}
