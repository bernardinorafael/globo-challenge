import { cn } from "@/src/util/cn"

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "base" | "lg" | "jumbo"
}

export function Spinner({ className, size = "base", ...props }: SpinnerProps) {
  return (
    <div
      className={cn(
        "relative inline-block",
        size === "sm" && "size-4",
        size === "base" && "size-5",
        size === "lg" && "size-6",
        size === "jumbo" && "size-10",
        className
      )}
      {...props}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="spinner-blade" />
      ))}
    </div>
  )
}
