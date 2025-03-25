import React from "react"

import { cn } from "@/src/util/cn"

export const EmptyIcon = React.forwardRef<
  HTMLSpanElement,
  Pick<React.ComponentProps<"span">, "children" | "className">
>(({ className, ...props }, forwardedRef) => (
  <span
    ref={forwardedRef}
    className={cn(
      "text-foreground-secondary order-1 rounded-lg bg-gray-300 p-3 [&>svg]:size-8 [&>svg]:stroke-[1.5px]",
      className
    )}
    {...props}
  />
))
