import React from "react"

import { cn } from "@/src/util/cn"

export const EmptyDescription = React.forwardRef<
  HTMLSpanElement,
  Pick<React.ComponentProps<"span">, "children" | "className">
>(({ className, ...props }, forwardedRef) => (
  <span
    ref={forwardedRef}
    className={cn("order-3 text-base text-foreground-secondary", className)}
    {...props}
  />
))
