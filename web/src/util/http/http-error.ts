import type { ErrCodes } from "@/src/enums"

export class HTTPError extends Error {
  code: ErrCodes

  constructor(params: { code: ErrCodes; message: string }) {
    super(params.message)

    this.name = "HTTPError"
    this.code = params.code

    Object.setPrototypeOf(this, HTTPError.prototype)
  }
}

export function isHTTPError(error?: unknown): error is HTTPError {
  return (
    typeof error === "object" && error !== null && "message" in error && "code" in error
  )
}
