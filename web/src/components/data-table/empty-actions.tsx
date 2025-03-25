import React from "react"

import { cn } from "@/src/util/cn"

export const EmptyActions = React.forwardRef<
  HTMLSpanElement,
  Pick<React.ComponentProps<"span">, "children" | "className">
>(({ className, ...props }, forwardedRef) => (
  <span ref={forwardedRef} className={cn("order-4 pt-4", className)} {...props} />
))
