import React from "react"

import { cn } from "@/src/util/cn"

export const Body = React.forwardRef<
  HTMLTableSectionElement,
  Pick<React.ComponentProps<"tbody">, "children" | "className">
>(({ className, ...rest }, forwardedRef) => (
  <tbody className={cn("relative", className)} ref={forwardedRef} {...rest} />
))
