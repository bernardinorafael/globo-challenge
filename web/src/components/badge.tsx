import { cn } from "@/src/util/cn"
import { tv, type VariantProps } from "tailwind-variants"

export type BadgeProps = VariantProps<typeof root> & {
  className?: string
  children: React.ReactNode
}

const root = tv({
  base: [
    "relative",
    "isolate",
    "inline-flex",
    "flex-none",
    "items-center",
    "rounded-sm",
    "bg-clip-border",
    "after:absolute",
    "after:inset-0",
    "after:rounded-inherit",
    "after:bg-gradient-to-b",
    "after:from-transparent",
    "after:to-black",
    "after:opacity-2",
  ],
  variants: {
    intent: {
      secondary: "border-gray-500/10 bg-gray-50 text-gray-500",
      success: "border-green-500/10 bg-green-50 text-green-600",
      warning: "border-orange-500/10 bg-orange-50 text-orange-600",
      info: "border-blue-500/10 bg-blue-50 text-blue-600",
      danger: "border-red-500/10 bg-red-50 text-red-600",
      primary: "border-purple-500/10 bg-purple-50 text-purple-600",
    },
  },
  compoundVariants: [
    {
      intent: ["secondary", "success", "warning", "danger", "primary", "info"],
      class: "border px-[0.3125rem] py-px",
    },
  ],
})

export function Badge(props: BadgeProps) {
  return (
    <div
      className={cn(
        "relative inline-flex rounded-[0.375rem]",
        "after:border-blue after:absolute after:opacity-0",
        "after:-inset-1 after:rounded-inherit after:border-2",
        "focus-visible:after:opacity-100"
      )}
    >
      <span className={cn(props.className, root({ intent: props.intent }))}>
        <span className="relative whitespace-nowrap text-xs font-medium">
          {props.children}
        </span>
      </span>
    </div>
  )
}
