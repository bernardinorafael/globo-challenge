import React from "react"

export const Empty = React.forwardRef<
  HTMLDivElement,
  Pick<React.ComponentProps<"div">, "children" | "className">
>((props, forwardedRef) => (
  <div
    ref={forwardedRef}
    className="flex min-h-[20rem] flex-col items-center justify-center gap-2 p-12 text-center"
    {...props}
  />
))
