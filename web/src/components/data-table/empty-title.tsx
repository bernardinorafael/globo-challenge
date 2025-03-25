import React from "react"

import { cn } from "@/src/util/cn"

export const EmptyTitle = React.forwardRef<
  HTMLSpanElement,
  Pick<React.ComponentProps<"span">, "children" | "className">
>(({ className, ...props }, forwardedRef) => (
  <span
    ref={forwardedRef}
    className={cn("order-2 text-xl font-semibold text-foreground", className)}
    {...props}
  />
))
