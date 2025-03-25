import React from "react"

import { useFieldControl } from "@/src/components/field"
import { cn } from "@/src/util/cn"
import { tv, type VariantProps } from "tailwind-variants"

const root = tv({
  base: [
    "flex",
    "relative",
    "transition",
    "self-start",
    "flex-row",
    "rounded",
    "shadow",
    "ring-1",
    "shadow-black/[0.08]",
    "bg-[--input-root-bg-color]",
    "focus-within:ring-offset-1",
    "ring-[--input-border-color]",
    "focus-within:ring-[0.1875rem]",
    "focus-within:ring-[--input-ring-color]",
    "focus-within:ring-offset-[--input-border-color-focus]",
  ],
  variants: {
    type: {
      text: null,
      email: null,
      number: null,
      tel: null,
      url: null,
      search: ["[--input-pl:theme(spacing.8)]"],
      password: null,
    },
    _validity: {
      initial: [
        "[--input-border-color:theme(colors.black/0.1)]",
        "[--input-border-color-focus:theme(colors.black/0.15)]",
        "[--input-ring-color:theme(colors.black/0.08)]",
      ],
      error: [
        "[--input-border-color:theme(colors.red.600)]",
        "[--input-border-color-focus:theme(colors.red.600)]",
        "[--input-ring-color:theme(colors.red.600/0.2)]",
      ],
      warning: [
        "[--input-border-color:theme(colors.orange.800)]",
        "[--input-border-color-focus:theme(colors.orange.800)]",
        "[--input-ring-color:theme(colors.orange.500/0.3)]",
      ],
      success: [
        "[--input-border-color:theme(colors.green.400)]",
        "[--input-border-color-focus:theme(colors.green.400)]",
        "[--input-ring-color:theme(colors.green.500/0.25)]",
      ],
    },
    size: {
      base: "h-8",
      md: "h-9",
      lg: "h-11",
    },
    readOnly: {
      true: "[--input-root-bg:theme(colors.gray.200)]",
      false: "[--input-root-bg:theme(colors.white)]",
    },
    disabled: {
      true: "cursor-not-allowed opacity-50",
      false: null,
    },
  },
  compoundVariants: [
    {
      type: ["text", "email", "number", "password", "tel"],
      className: "[--input-pl:--input-px] [--input-px:theme(spacing.3)]",
    },
  ],
})

const input = tv({
  base: [
    "flex-1",
    "bg-white",
    "text-base",
    "outline-none",
    "px-[--input-px]",
    "pl-[--input-pl]",
    "appearence-none truncate rounded-inherit",
    "placeholder:text-foreground-placeholder",
  ],
})

export type InputProps = Pick<
  React.ComponentProps<"input">,
  | "className"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onKeyDown"
  | "onFocus"
  | "onBlur"
  | "aria-label"
  | "name"
  | "placeholder"
  | "required"
  | "disabled"
  | "autoFocus"
  | "autoComplete"
  | "autoCorrect"
  | "spellCheck"
  | "min"
  | "max"
  | "id"
  | "readOnly"
  | "maxLength"
> & {
  type?: "text" | "search" | "email" | "number" | "url" | "password" | "tel"
  size?: VariantProps<typeof root>["size"]
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      id,
      name,
      value,
      size = "base",
      type = "text",
      readOnly = false,
      disabled = false,
      className,
      ...props
    },
    forwardedRef
  ) => {
    const control = useFieldControl({
      element: "input",
      props: { id },
    })

    return (
      <div
        className={cn(
          root({
            type,
            size,
            disabled,
            readOnly,
            _validity: control?.messageIntent || "initial",
            className,
          })
        )}
      >
        <input
          type={type}
          name={name}
          ref={forwardedRef}
          value={value}
          disabled={disabled}
          className={input()}
          {...control.props}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = "Input"
