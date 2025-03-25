import React from "react"

import { cn } from "@/src/util/cn"
import type { LucideIcon } from "lucide-react"

export function EmptyState(props: {
  title: string
  description: string
  icon?: LucideIcon
  withBorder?: boolean
  size?: "sm" | "md"
}) {
  const size = props.size ?? "md"
  const withBorder = props.withBorder ?? false

  return (
    <div
      className={cn(
        "group/empty-state flex w-full flex-col items-center bg-white text-center",
        {
          "rounded-lg border-2 border-dashed border-zinc-300": withBorder,
          "p-8": size === "sm",
          "p-12": size === "md",
        }
      )}
    >
      {props.icon && (
        <div className="grid place-items-center rounded-lg bg-zinc-50 p-3 shadow-xs">
          {React.createElement(props.icon, {
            className: cn("stroke-[1.5px] size-6"),
          })}
        </div>
      )}

      <h2
        className={cn("mt-4 font-semibold text-text-primary", {
          "text-lg": size === "sm",
          "text-xl": size === "md",
        })}
      >
        {props.title}
      </h2>

      <p
        className={cn("whitespace-pre-line text-text-secondary", {
          "text-sm": size === "sm",
          "text-base": size === "md",
        })}
      >
        {props.description}
      </p>
    </div>
  )
}
