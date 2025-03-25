import { Button } from "@/src/components/button"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

type DialogHeaderProps = {
  title: string | React.ReactNode
  description?: React.ReactNode
}

export function Header({ title, description }: DialogHeaderProps) {
  return (
    <div className="relative flex items-start gap-6 px-5 py-4">
      <div className="flex w-full flex-col gap-1">
        <DialogPrimitive.Title className="text-balance text-xl font-semibold text-text-primary">
          {title}
        </DialogPrimitive.Title>
        <DialogPrimitive.Description className="max-w-[50ch] text-base text-text-secondary">
          {description}
        </DialogPrimitive.Description>
      </div>

      <DialogPrimitive.Close asChild>
        <Button size="sm" variant="ghost">
          <X size={16} className="text-text-secondary" />
        </Button>
      </DialogPrimitive.Close>
    </div>
  )
}
