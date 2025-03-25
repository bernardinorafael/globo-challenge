import React from "react"

import { cn } from "@/src/util/cn"

type LabelProps = {
  htmlFor: string
  optional?: boolean
  disabled?: boolean
  omitLabel?: boolean
  id?: string
  children: React.ReactNode
  className?: string
}

export function Label({
  children,
  htmlFor,
  className,
  omitLabel,
  disabled = false,
  // optional = false,
}: LabelProps) {
  return (
    <div className="group flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className={cn(
          "flex select-none items-center gap-2 pl-[--label-padding] text-base font-medium",
          disabled && "text-gray-400",
          omitLabel && "sr-only",
          className
        )}
      >
        {children}
      </label>
      {/* {optional && <span className="text-sm text-gray-400">Opcional</span>} */}
    </div>
  )
}
