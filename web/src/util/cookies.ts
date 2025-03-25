export function setCookie({
  name,
  value,
  days = 1,
  secure = false,
  httpOnly = false,
}: {
  name: string
  value: string
  days?: number
  secure?: boolean
  httpOnly?: boolean
}) {
  const now = new Date()
  now.setDate(now.getDate() + days)

  let cookieString = `${name}=${value}; expires=${now.toUTCString()}; path=/`

  if (secure) cookieString += "; Secure"
  if (httpOnly) cookieString += "; HttpOnly"

  document.cookie = cookieString
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export function getCookie(name: string) {
  const cookies = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))
  return cookies ? cookies.split("=")[1] : null
}
