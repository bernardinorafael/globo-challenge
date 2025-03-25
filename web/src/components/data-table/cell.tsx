import React from "react"

import { cn } from "@/src/util/cn"
import { tv, type VariantProps } from "tailwind-variants"

const root = tv({
  base: [
    "border-0",
    "text-left",
    "overflow-hidden",
    "bg-clip-padding",
    "px-[--data-table-cell-px]",
    "py-[--data-table-cell-py]",
    "bg-[var(--data-table-row-bg,var(--data-table-cell-bg))]",
    "border-t-[length:--data-table-cell-border-t-width,0]",
  ],
  variants: {
    paddingLeft: {
      true: "pl-0",
      false: null,
    },
    paddingRight: {
      true: "pr-0",
      false: null,
    },
  },
})

export const Cell = React.forwardRef<
  HTMLTableCellElement,
  Pick<
    React.ComponentProps<"td">,
    "children" | "className" | "colSpan" | "headers" | "rowSpan"
  > &
    VariantProps<typeof root>
>(({ className, paddingLeft = false, paddingRight = false, ...rest }, forwardedRef) => (
  <td
    data-table-cell=""
    className={cn(root({ paddingLeft, paddingRight, className }))}
    ref={forwardedRef}
    {...rest}
  />
))
