import { Spinner } from "@/src/components/spinner"

export function PageLoader() {
  return (
    <div className="text-text-primary flex h-[60vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <Spinner size="jumbo" />
        <p className="text-text-secondary text-base font-medium">Carregando</p>
      </div>
    </div>
  )
}
