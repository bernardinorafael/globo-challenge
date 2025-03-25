import React from "react"

import { cn } from "@/src/util/cn"
import { AsChildProp } from "@/src/util/slot/slot.tsx"

type ActionsAttributes = React.HTMLAttributes<HTMLDivElement>

export const Actions = React.forwardRef<
  HTMLDivElement,
  Pick<ActionsAttributes, "children" | "className"> & AsChildProp
>(({ className, children, ...props }, ref) => (
  // "opacity-0 group-focus-within/table-row:opacity-100 group-hover/table-row:opacity-100",

  <div ref={ref} className={cn("centered", className)} {...props}>
    {children}
  </div>
))
