import * as React from "react"

import { cn } from "@/src/util/cn"
import { createLink, LinkComponent } from "@tanstack/react-router"

type BasicLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  icon?: React.ReactNode
  position?: "left" | "right"
  size?: "xs" | "sm" | "base" | "lg"
  className?: string
}

const BasicLinkComponent = React.forwardRef<HTMLAnchorElement, BasicLinkProps>(
  ({ icon, size = "sm", position = "left", ...props }, ref) => {
    return (
      <div className="inline-flex items-center gap-1.5 text-text-primary">
        {icon && position === "left" && <span>{icon}</span>}
        <a
          ref={ref}
          {...props}
          className={cn(
            "pt-0.5 hover:underline hover:underline-offset-[3px]",
            size === "xs" && "text-xs",
            size === "sm" && "text-sm",
            size === "base" && "text-base",
            size === "lg" && "text-lg",
            props.className
          )}
        />
        {icon && position === "right" && <span>{icon}</span>}
      </div>
    )
  }
)

const CreatedLinkComponent = createLink(BasicLinkComponent)

export const CustomLink: LinkComponent<typeof BasicLinkComponent> = (props) => {
  return <CreatedLinkComponent preload="intent" {...props} />
}
