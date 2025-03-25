import React from "react"

import { cn } from "@/src/util/cn"

export const Row = React.forwardRef<
  HTMLTableRowElement,
  Pick<React.ComponentProps<"tr">, "children" | "className">
>((props, forwardRef) => (
  <tr
    className={cn(
      "group/table-row text-base",
      // `RowLink`
      // 1. Prevent the `RowLink` background overflowing the `Row` in Safari
      // 2. Float all interactive elements above the `RowLink`
      "has-[[data-table-row-link]]:relative",
      "has-[[data-table-row-link]]:isolate",
      "has-[[data-table-row-link]]:hover:[--data-table-row-bg:--data-table-cell-bg-hover]",
      "has-[[data-table-row-link]]:focus-within:[--data-table-row-bg:--data-table-cell-bg-hover]",
      "has-[[data-table-row-link]]:[clip-path:inset(0)]", // [1]
      "[&:has([data-table-row-link])_:where(a,button)]:z-[1]", // [2]
      // Border between each `Row`
      "[&+&]:[--data-table-cell-border-t-width:--data-table-border-width]"
    )}
    ref={forwardRef}
    {...props}
  />
))
