import { cn } from "@/src/util/cn"

type DialogContentProps = {
  children: React.ReactNode
  className?: string
}

export function Content({ children, className }: DialogContentProps) {
  return (
    <div
      className={cn(
        "shadow shadow-black/[.06] ring-1 ring-black/[0.06]",
        "group/dialog-content overflow-hidden rounded-lg bg-white",
        className
      )}
    >
      {children}
    </div>
  )
}
