import React, { type CSSProperties } from "react"

import { cn } from "@/src/util/cn"

type TableHeaderProps = Pick<
  React.ComponentProps<"th">,
  "abbr" | "children" | "className" | "colSpan" | "headers" | "rowSpan" | "scope"
> & {
  width?: CSSProperties["width"]
  omit?: boolean
}

export const Header = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ width, children, className, omit, ...rest }, forwardedRef) => (
    <th
      ref={forwardedRef}
      className={cn(
        "[&:has([data-table-sort])_[data-table-sort-spacer]]:hidden",
        "w-[--data-table-header-w,unset] overflow-hidden text-sm font-medium",
        "px-[--data-table-header-px] text-left leading-[--data-table-header-leading]",
        "pb-[--data-table-header-pb] pt-[--data-table-header-pt] text-foreground-secondary",
        className
      )}
      style={{ ["--data-table-header-w" as string]: width }}
      {...rest}
    >
      <span className={cn("inline-flex", omit && "sr-only")}>
        {children}
        <span data-table-sort-spacer="" className="ml-1 size-4 bg-transparent" />
      </span>
    </th>
  )
)
