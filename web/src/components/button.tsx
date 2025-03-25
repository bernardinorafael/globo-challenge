import React, { forwardRef } from "react"

import { Spinner } from "@/src/components/spinner"
import { cn } from "@/src/util/cn"
import { AnimatePresence, motion } from "motion/react"
import { tv, type VariantProps } from "tailwind-variants"

export const buttonVariants = tv({
  base: [
    "group",
    "isolate",
    "relative",
    "inline-flex",
    "flex-none",
    "select-none",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "outline-none",
    "font-medium",
    "transition",
    "duration-300",
    "before:transition",
    "bg-[--button-color-bg]",
    "after:transition",
    "ring-[0.1875rem]",
    "ring-transparent",
    "ring-offset-[0.0625rem]",
    "ring-offset-[--button-color-border]",
    "focus-visible:ring-[--button-color-ring]",
    "before:bg-[radial-gradient(75%_75%_at_center_top,theme(colors.white/0.2),transparent)]",
    "disabled:cursor-not-allowed",
  ],
  variants: {
    variant: {
      primary: [
        [
          "[--button-color-border:--button-color-bg]",
          "[--button-color-bg:theme(colors.accent)]",
          "[--button-color-ring:theme(colors.violet.300)]",
          "[--button-color-text:theme(colors.white)]",
          "[--button-text-shadow:0px_1px_3px_theme(colors.black/0.25)]",
          "enabled:hover:before:opacity-0",
        ],
        "relative",
        "before:inset-0",
        "before:absolute",
        "before:rounded-inherit",
        "before:transition-opacity",
        "shadow-[0px_2px_3px_theme(colors.gray.800/0.2),_0px_0px_0px_1px_theme(colors.accent),_inset_0px_1px_0px_theme(colors.white/0.07)]",
      ],
      secondary: [
        [
          "[--button-color-border:theme(colors.black/0.15)]",
          "[--button-color-bg:theme(colors.white)]",
          "[--button-color-ring:theme(colors.black/0.08)]",
          "enabled:hover:bg-zinc-100",
        ],
        "shadow",
        "shadow-black/[0.08]",
        "transition",
        "before:absolute",
        "before:inset-0",
        "before:from-50%",
        "before:rounded-inherit",
        "before:to-black/[0.02]",
        "before:transition-opacity",
        "before:bg-gradient-to-b",
        "before:from-black/0",
      ],
      ghost: [
        "[--button-color-border:--button-color-bg]",
        "[--button-color-bg:theme(colors.transparent)]",
        "[--button-color-ring:theme(colors.black/0.08)]",
        "[--button-color-text:theme(colors.foreground)]",
        "enabled:hover:bg-zinc-200/70",
      ],
      danger: [
        [
          "[--button-color-border:--button-color-bg]",
          "[--button-color-bg:theme(colors.red.500)]",
          "[--button-color-ring:theme(colors.red.500/0.2)]",
          "[--button-color-text:theme(colors.white)]",
          "[--button-text-shadow:0px_1px_3px_theme(colors.black/0.25)]",
          "enabled:hover:before:opacity-0",
        ],
        "relative",
        "before:inset-0",
        "before:absolute",
        "before:rounded-inherit",
        "before:transition-opacity",
        "shadow-[0px_2px_3px_theme(colors.gray.800/0.2),_0px_0px_0px_1px_theme(colors.red.500),_inset_0px_1px_0px_theme(colors.white/0.07)]",
      ],
    },
    size: {
      xs: "h-5 rounded-[0.3125rem] px-2 text-xs",
      sm: "h-6 rounded-[0.3125rem] px-2 text-sm",
      base: "h-8 rounded px-2.5 text-base",
    },
  },
})

const buttonContent = tv({
  base: [
    "gap-1.5",
    "w-full",
    "inline-flex",
    "items-center",
    "transition",
    "whitespace-nowrap",
    "text-[--button-color-text]",
    "drop-shadow-[--button-text-shadow]",
    // Calculates the button height based on spacing and font size
    // Used to animate the button with the spinner
    "[--button-height:calc((theme(spacing.3)+theme(fontSize.base[1].lineHeight))*-1)]",
  ],
})

export type ButtonProps = Pick<
  React.ComponentProps<"button">,
  | "id"
  | "form"
  | "aria-label"
  | "className"
  | "disabled"
  | "onBlur"
  | "onClick"
  | "onFocus"
  | "tabIndex"
  | "children"
  | "role"
  | "type"
> &
  VariantProps<typeof buttonVariants> & {
    children: React.ReactNode
    full?: boolean
    loading?: boolean
  }

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    disabled = false,
    variant = "secondary",
    type = "button",
    size = "base",
    full = false,
    loading = false,
    ...props
  },
  forwardedRef
) {
  return (
    <button
      ref={forwardedRef}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      <>
        {/* <span className={cn(buttonContent(), full && "w-full justify-center")}> */}
        <div className="inline-flex w-full">
          <motion.span
            style={{ y: loading ? "var(--button-height)" : "0%" }}
            className={cn(buttonContent(), full && "w-full justify-center")}
          >
            {children}
          </motion.span>

          <AnimatePresence>
            {loading && (
              <motion.div
                transition={{
                  type: "spring",
                  stiffness: 150,
                  damping: 15,
                  mass: 0.5,
                  opacity: {
                    duration: 0.3,
                  },
                }}
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                className="absolute inset-0 z-10 flex items-center justify-center text-[--button-color-text]"
              >
                <Spinner size="base" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </>
    </button>
  )
})
