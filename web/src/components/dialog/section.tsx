export function Section({ children }: { children: React.ReactNode }) {
  return (
    <section data-id="section" className="space-y-5 px-5 pb-6 pt-4.5">
      {children}
    </section>
  )
}
