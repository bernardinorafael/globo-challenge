type DialogFooterProps = {
  children: React.ReactNode
}

export function Footer({ children }: DialogFooterProps) {
  return <div className="flex items-center justify-end gap-3 px-5 py-4">{children}</div>
}
