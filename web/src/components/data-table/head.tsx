import React from "react"

type HeadAttributes = React.HTMLAttributes<HTMLTableSectionElement>

export const Head = React.forwardRef<HTMLTableSectionElement, HeadAttributes>(
  (props: Pick<HeadAttributes, "children" | "className">, forwardedRef) => (
    <thead ref={forwardedRef} {...props} />
  )
)
