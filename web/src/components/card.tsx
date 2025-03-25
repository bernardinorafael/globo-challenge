import { forwardRef } from "react"

import { useControllableState } from "@/src/hooks/use-controllable-state"
import { cn } from "@/src/util/cn"
import { AnimatePresence, motion } from "motion/react"
import { tv, type VariantProps } from "tailwind-variants"

type CollapsibleProps = {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const root = tv({
  base: [
    "isolate",
    "relative",
    "rounded-2xl",
    "p-[--card-p]",
    "overflow-hidden",
    "[--card-p:theme(space.1)]",
    "[--card-item-p:theme(space.4)]",
  ],
  variants: {
    background: {
      intense: "bg-surface-50",
      soft: "bg-surface-100",
    },
    spacing: {
      none: "[--card-body-px:0] [--card-body-py:0]",
      compact: "[--card-body-px:--card-item-p] [--card-body-py:--card-item-p]", // 16px × 16px
      cozy: "[--card-body-px:theme(space.8)] [--card-body-py:theme(space.6)]", // 32x × 24px
    },
  },
})

type RootRef = HTMLDivElement
type RootAttributes = React.HTMLAttributes<RootRef>
export type CardVariantsProps = VariantProps<typeof root>

export const Root = forwardRef(function CardRoot(
  {
    className,
    spacing = "cozy",
    background = "soft",
    ...props
  }: Pick<RootAttributes, "children" | "className"> &
    Pick<CardVariantsProps, "background"> &
    Pick<CardVariantsProps, "spacing">,
  ref: React.ForwardedRef<RootRef>
) {
  return (
    <section
      ref={ref}
      data-card-root=""
      className={root({ background, spacing, className })}
      {...props}
    />
  )
})

type HeaderRef = HTMLDivElement
type HeaderAttributes = React.HTMLAttributes<HeaderRef>

export const Header = forwardRef(function CardHeader(
  { className, ...props }: Pick<HeaderAttributes, "children" | "className">,
  ref: React.ForwardedRef<HeaderRef>
) {
  return (
    <header
      ref={ref}
      data-card-header=""
      className={cn(
        "grid grid-rows-1 items-center gap-x-6 gap-y-0.5 p-[--card-item-p]",
        // if both title and description are present
        //   i.   expand to 2 rows
        //   ii.  nudge the actions for optical alignment
        //   iii. bump the description down a row
        "has-[[data-card-title]]:has-[[data-card-description]]:grid-rows-[repeat(2,minmax(0,min-content))]",
        "has-[[data-card-title]]:has-[[data-card-description]]:[--card-actions-mt:theme(spacing.[0.5])]",
        "has-[[data-card-title]]:has-[[data-card-description]]:[--card-description-row-start:2]",
        // if actions are present, expand to 2 columns
        "has-[[data-card-actions]]:grid-cols-[1fr,minmax(0,min-content)]",
        className
      )}
      {...props}
    />
  )
})

type TitleRef = HTMLHeadingElement
type TitleAttributes = React.HTMLAttributes<TitleRef>

export const Title = forwardRef(function CardTitle(
  { className, ...props }: Pick<TitleAttributes, "children" | "className">,
  ref: React.ForwardedRef<TitleRef>
) {
  return (
    <h2
      ref={ref}
      data-card-title=""
      className={cn(
        "text-text-primary col-start-1 row-start-1 text-balance font-sans text-lg font-medium",
        className
      )}
      {...props}
    />
  )
})

type DescriptionRef = HTMLHeadingElement
type DescriptionAttributes = React.HTMLAttributes<DescriptionRef>

export const Description = forwardRef(function CardDescription(
  { className, ...props }: Pick<DescriptionAttributes, "children" | "className">,
  ref: React.ForwardedRef<DescriptionRef>
) {
  return (
    <span
      ref={ref}
      data-card-description=""
      className={cn(
        "text-text-secondary font-sans text-sm font-normal",
        "col-start-1 row-start-[--card-description-row-start,1] text-balance",
        className
      )}
      {...props}
    />
  )
})

type BodyRef = HTMLDivElement
type BodyAttributes = React.HTMLAttributes<BodyRef>

export const Body = forwardRef(function CardBody(
  {
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    children,
    className,
  }: Pick<BodyAttributes, "children" | "className"> & CollapsibleProps,
  ref: React.ForwardedRef<BodyRef>
) {
  const [open] = useControllableState({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  })

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          ref={ref}
          data-card-body=""
          initial={{
            height: 0,
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            height: "auto",
            opacity: 1,
            scale: 1,
          }}
          exit={{
            height: 0,
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 },
          }}
          transition={{
            duration: 0.3,
            opacity: { delay: 0.1 },
          }}
        >
          <div
            className={cn(
              "bg-surface-200 shadow-xs rounded-xl px-[--card-body-px] py-[--card-body-py]",
              className
            )}
          >
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

type RowRef = HTMLDivElement
type RowAttributes = React.HTMLAttributes<RowRef>

export const Row = forwardRef(function CardRow(
  { className, ...props }: Pick<RowAttributes, "children" | "className">,
  ref: React.ForwardedRef<RowRef>
) {
  return (
    <div
      ref={ref}
      data-card-row=""
      className={cn(
        "py-[--card-body-py] [&+&]:border-t",
        "-mx-[--card-body-px] px-[--card-body-px]",
        "first:-mt-[--card-body-py]",
        "last:-mb-[--card-body-py]",
        className
      )}
      {...props}
    />
  )
})

type ActionsRef = HTMLDivElement
type ActionsAttributes = React.HTMLAttributes<ActionsRef>

export const Actions = forwardRef(function CardActions(
  { className, ...props }: Pick<ActionsAttributes, "children" | "className">,
  ref: React.ForwardedRef<ActionsRef>
) {
  return (
    <div
      ref={ref}
      data-card-actions=""
      className={cn(
        "mt-[--card-actions-mt,0]",
        "col-start-2 row-span-full place-self-start",
        "flex min-w-0 flex-shrink-0 items-start gap-3",
        className
      )}
      {...props}
    />
  )
})

type FooterRef = HTMLDivElement
type FooterAttributes = React.HTMLAttributes<FooterRef>

export const Footer = forwardRef(function CardFooter(
  {
    defaultOpen = true,
    open: openProp,
    onOpenChange,
    children,
    className,
  }: Pick<FooterAttributes, "children" | "className"> & CollapsibleProps,
  ref: React.ForwardedRef<FooterRef>
) {
  const [open] = useControllableState({
    defaultProp: defaultOpen,
    onChange: onOpenChange,
    prop: openProp,
  })

  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.footer
          ref={ref}
          data-card-footer=""
          className="overflow-hidden"
          initial={{ opacity: 0, height: 0 }}
          exit={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.2, opacity: { delay: 0.1 } }}
        >
          <div
            className={cn(
              "-mb-[--card-p] grid grid-rows-1 items-center gap-6",
              "gap-y-2 p-[--card-item-p] [&>:not([data-card-actions])]:col-start-1",
              "has-[[data-card-actions]]:grid-cols-[1fr,minmax(0,min-content)]",
              className
            )}
          >
            {children}
          </div>
        </motion.footer>
      )}
    </AnimatePresence>
  )
})
