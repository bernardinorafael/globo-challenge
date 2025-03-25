import { TokenKeys } from "@/src/enums" // import { getCookie } from "@/src/util/cookies"
import { getCookie } from "@/src/util/cookies"
import { HTTPError, isHTTPError } from "@/src/util/http/http-error"
import { sleep } from "@/src/util/sleep"

type FetcherOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  data?: Record<string, unknown> | FormData
  path: string
}

/**
 * - **method**: HTTP method `(GET, POST, PUT, PATCH, DELETE)`
 * - **path**: The path to the resource
 * - **data**: `Object` or `FormData` to send in the request
 *
 * @returns {Promise<T>} The parsed response
 */
export function request<T>(props: FetcherOptions): Promise<T> {
  return rawRequest<T>(props)
}

async function rawRequest<T>({ method = "GET", path, data }: FetcherOptions): Promise<T> {
  const url = new URL(path, import.meta.env["VITE_SERVER_URL"]).toString()
  const headers: HeadersInit = {}

  const accessToken = getCookie(TokenKeys.AccessToken)

  if (accessToken) {
    headers["Authorization"] = accessToken
  }

  let body = null
  if (data instanceof FormData) {
    body = data
  } else {
    headers["Content-Type"] = "application/json"
    body = method === "GET" ? null : JSON.stringify(data)
  }

  const res = await fetch(url, { cache: "no-store", body, headers, method })

  // NOTE: This is a hack to simulate a slow response and testing the loading state across the app
  if (process.env.NODE_ENV === "development") {
    await sleep(250)
  }

  if (!res.ok) {
    const body = await res.json()
    if (isHTTPError(body)) throw new HTTPError(body)
  }

  return res.json()
}
