import React from "react"

import { cn } from "@/src/util/cn"
import { tv, VariantProps } from "tailwind-variants"

const root = tv({
  base: [
    "flex",
    "flex-col",
    "isolate",
    "relative",
    "rounded-2xl",
    "overflow-hidden",
    "bg-[--data-table-bg]",
    "p-[--data-table-p]",
    "[--data-table-border-width:theme(spacing.px)]",
    "[--data-table-focus-ring-color:theme(colors.legacyGray.300)]",
    "[--data-table-focus-ring-width:0.1875rem]",
    "[--data-table-p:theme(spacing.1)]",
    [
      "[--data-table-cell-bg:theme(backgroundColor.surface.200)]",
      "[--data-table-cell-bg-hover:theme(colors.legacyGray.25)]",
    ],
    "[--data-table-body-rounded:theme(borderRadius.xl)]",
    "[--data-table-header-px:--data-table-cell-px]",
    "[--data-table-header-pt:theme(spacing.3)]",
    "[--data-table-header-leading:theme(lineHeight.4)]",
    "[--data-table-header-pb:calc(var(--data-table-header-pt)-var(--data-table-border-width))]",
    "[--data-table-head-height:calc(var(--data-table-header-pt)+var(--data-table-header-pb)+var(--data-table-header-leading))]",
  ],
  variants: {
    background: {
      intense: "[--data-table-bg:theme(backgroundColor.surface.50)]",
      soft: "[--data-table-bg:theme(backgroundColor.surface.100)]",
    },
    spacing: {
      compact:
        "[--data-table-cell-px:theme(spacing.4)] [--data-table-cell-py:theme(spacing.3)]",
      cozy: "[--data-table-cell-px:theme(spacing.4)] [--data-table-cell-py:theme(spacing.4)]",
    },
  },
})

type RootTableProps = React.ComponentProps<"table"> & VariantProps<typeof root>

export const Root = React.forwardRef<HTMLTableElement, RootTableProps>(
  (
    { children, className, background = "soft", spacing = "cozy", ...props },
    forwardedRef
  ) => {
    return (
      <section
        data-table-root=""
        className={root({ className, spacing, background })}
        {...props}
      >
        <div
          className={cn(
            "relative isolate order-1 -mt-[--data-table-p]",
            // `Head` Mask
            // 1. Left overlay
            "before:absolute before:left-0 before:top-0 before:z-1 before:h-[--data-table-head-height]",
            "before:bg-gradient-to-r before:from-[--data-table-bg] before:to-transparent",
            // 2. Right overlay
            "after:absolute after:right-0 after:top-0 after:z-1 after:h-[--data-table-head-height] after:w-[--data-table-header-px]",
            "after:bg-gradient-to-l after:from-[--data-table-bg] after:to-transparent"
          )}
        >
          <div
            className={cn(
              // Add a background to the `Body`
              // (visible when scrolling beyond the scroll boundary in some OSs such as macOS)
              "after:absolute after:inset-0 after:top-[--data-table-head-height]",
              "after:z-[-1] after:rounded-[--data-table-body-rounded] after:bg-[--data-table-cell-bg]"
            )}
          >
            <div
              className={cn(
                "overflow-hidden",
                // Clip the area around the table body with a ring that matches the
                // outer background color; hiding any overflow
                // (with an extra 2px wiggle room)
                "before:pointer-events-none before:inset-0 before:z-1",
                "before:absolute before:top-[--data-table-head-height]",
                "before:ring-[length:calc(var(--data-table-p)+theme(spacing.[0.5]))] before:ring-[--data-table-bg]",
                "before:rounded-[--data-table-body-rounded]",
                // Add a border and shadow to the `Body`
                "after:absolute after:inset-0 after:top-[--data-table-head-height] after:z-2",
                "after:pointer-events-none after:rounded-[--data-table-body-rounded] after:shadow-xs"
              )}
            >
              <div className="relative overflow-x-auto [overscroll-behavior-x:contain]">
                <table
                  ref={forwardedRef}
                  className="relative w-full table-fixed caption-bottom whitespace-nowrap"
                >
                  {children}
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
)
