import { Button, type ButtonProps } from "@/src/components/button"
import { useControllableState } from "@/src/hooks/use-controllable-state"
import { cn } from "@/src/util/cn"
import * as RadixDropdown from "@radix-ui/react-dropdown-menu"

export type DropdownMenuTriggerProps = {
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
}

function Root({
  children,
  ...props
}: {
  open?: boolean
  children: React.ReactNode
  defaultOpen?: boolean
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [open = false, setOpen] = useControllableState({
    onChange: props.onOpenChange,
    defaultProp: props.defaultOpen,
    prop: props.open,
  })

  return (
    <RadixDropdown.Root modal={false} open={open} onOpenChange={setOpen}>
      {children}
    </RadixDropdown.Root>
  )
}

function Trigger(props: {
  disabled?: boolean
  children: React.ReactNode
  triggerProps?: DropdownMenuTriggerProps
}) {
  return (
    <RadixDropdown.Trigger disabled={props.disabled} asChild>
      <Button data-menu-trigger aria-label="dropdown menu" {...props.triggerProps}>
        {props.children}
      </Button>
    </RadixDropdown.Trigger>
  )
}

function Content({
  children,
  className,
  side = "bottom",
  align = "center",
}: {
  children: React.ReactNode
  className?: string
  side?: "top" | "right" | "bottom" | "left"
  align?: RadixDropdown.DropdownMenuContentProps["align"]
}) {
  return (
    <RadixDropdown.Portal>
      <RadixDropdown.Content
        side={side}
        sideOffset={6}
        align={align}
        className={cn(
          "z-select",
          "bg-white",
          "border-zinc-300",
          "border",
          "shadow-lg",
          "rounded-lg",
          "min-w-[8rem]",
          "text-foreground",
          "overflow-hidden",
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95",
          "data-[state=open]:zoom-in-95",
          "data-[side=bottom]:slide-in-from-top-2",
          "data-[side=left]:slide-in-from-right-2",
          "data-[side=right]:slide-in-from-left-2",
          "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
      >
        {children}
      </RadixDropdown.Content>
    </RadixDropdown.Portal>
  )
}

function Item({
  icon,
  onClick,
  children,
  className,
  intent = "neutral",
  disabled = false,
}: {
  children: React.ReactNode
  icon?: React.ReactNode
  className?: string
  disabled?: boolean
  kbd?: string[]
  badge?: React.ReactNode
  intent?: "neutral" | "danger"
  onClick?: () => void
}) {
  return (
    <RadixDropdown.Item
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex",
        "gap-2",
        "px-2",
        "py-1.5",
        "relative",
        "font-medium",
        "text-base",
        "select-none",
        "items-center",
        "outline-none",
        "cursor-pointer",
        // Disabled
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-50",
        // Intent
        intent === "danger" && [
          "text-red-500",
          "focus:bg-red-200",
          "[--menu-item-icon-color:theme(colors.red.500)]",
        ],
        intent === "neutral" && [
          "text-foreground",
          "focus:bg-zinc-200",
          "[--menu-item-icon-color:theme(colors.zinc.500)]",
        ],
        className
      )}
    >
      {icon && (
        <span className="pb-0.5 text-[--menu-item-icon-color] [&>svg]:size-4 [&>svg]:shrink-0">
          {icon}
        </span>
      )}
      {children}
    </RadixDropdown.Item>
  )
}

function SubTrigger({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
  inset?: boolean
}) {
  return (
    <RadixDropdown.SubTrigger
      className={cn(
        "flex",
        "p-2",
        "gap-2",
        "rounded",
        "cursor-pointer",
        "select-none",
        "items-center",
        "outline-none",
        // Focused
        "focus:bg-surface-50",
        "data-[state=open]:bg-surface-50",
        // Icons
        "[&_svg]:pointer-events-none",
        "[&_svg]:size-4",
        "[&_svg]:shrink-0",
        className
      )}
    >
      {children}
    </RadixDropdown.SubTrigger>
  )
}

function SubContent({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <RadixDropdown.SubContent
      className={cn(
        "p-1",
        "z-50",
        "border",
        "bg-white",
        "shadow-lg",
        "rounded-lg",
        "min-w-[8rem]",
        "text-foreground",
        "overflow-hidden",
        "data-[state=open]:fade-in-0",
        "data-[state=open]:zoom-in-95",
        "data-[state=open]:animate-in",
        "data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0",
        "data-[state=closed]:zoom-out-95",
        "data-[side=bottom]:slide-in-from-top-2",
        "data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2",
        "data-[side=top]:slide-in-from-bottom-2",
        className
      )}
    >
      {children}
    </RadixDropdown.SubContent>
  )
}

function Separator() {
  return <RadixDropdown.Separator className={cn("-mx-1 h-px bg-gray-300")} />
}

function Group({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <RadixDropdown.Group className={cn("flex flex-col gap-1", className)}>
      {children}
    </RadixDropdown.Group>
  )
}

export const DropdownMenu = {
  Item,
  Root,
  Trigger,
  Content,
  SubTrigger,
  SubContent,
  Separator,
  Group,
}
