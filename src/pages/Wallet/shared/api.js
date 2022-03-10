export const Api = (path) => {
  const t = window.__BASE_API.split("|")
  console.log("process.env.NODE_ENV", process.env.NODE_ENV)
  let baseApi = t[0] === "{{BASE_API}}" ? t[1] : t[0]
  if (process.env.NODE_ENV !== "production") {
    baseApi = "https://bangde.xyz/api"
  }
  return baseApi + path
}
