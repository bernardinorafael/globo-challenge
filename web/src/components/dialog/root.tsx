import React from "react"

import { useControllableState } from "@/src/hooks/use-controllable-state"
import { cn } from "@/src/util/cn"
import * as RadixDialog from "@radix-ui/react-dialog"
import { AnimatePresence, motion } from "motion/react"

export type DialogProps = {
  open?: boolean
  trigger?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  size?: "sm" | "base" | "lg"
  onOpenChange?: (open: boolean) => void
}

export function Root({
  trigger,
  children,
  defaultOpen,
  size = "base",
  open: openProp,
  onOpenChange,
  disabled,
}: DialogProps & {
  disabled?: boolean
}) {
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  return (
    <RadixDialog.Root defaultOpen={defaultOpen} open={open} onOpenChange={setOpen}>
      {trigger && (
        <RadixDialog.Trigger disabled={disabled} asChild>
          {trigger}
        </RadixDialog.Trigger>
      )}
      <AnimatePresence>
        {open && (
          <RadixDialog.Portal forceMount>
            <RadixDialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.25 } }}
                className={cn(
                  "fixed inset-0 z-15 grid items-start justify-center py-40",
                  // "bg-black/40 backdrop-blur"
                  "bg-white/60 backdrop-blur-sm"
                )}
              >
                <RadixDialog.Content asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 40 }}
                    transition={{ type: "spring", bounce: 0, duration: 0.25 }}
                    className={cn(
                      "w-[94vw] rounded-xl bg-surface-100 p-1",
                      "shadow-lg ring-1 ring-black/[0.06] focus:outline-none",
                      size === "sm" && "max-w-[420px]",
                      size === "base" && "max-w-[490px]",
                      size === "lg" && "max-w-[610px]"
                    )}
                  >
                    {children}
                  </motion.div>
                </RadixDialog.Content>
              </motion.div>
            </RadixDialog.Overlay>
          </RadixDialog.Portal>
        )}
      </AnimatePresence>
    </RadixDialog.Root>
  )
}
