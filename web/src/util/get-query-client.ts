import { isHTTPError } from "@/src/util/http/http-error"
import { QueryClient } from "@tanstack/react-query"

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        retry(failure, err) {
          /**
           * We won't retry on known errors
           */
          if (isHTTPError(err)) return false
          /**
           * Retry on unknown errors
           */
          return failure < 3 ? true : false
        },
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

export function getQueryClient() {
  // Browser: Make a new query client if we don't already have one
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }

  return browserQueryClient
}
