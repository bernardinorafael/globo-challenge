import { Button } from "@/src/components/button"
import * as Card from "@/src/components/card"
import { CardSkeleton } from "@/src/components/card-skeleton"
import { Profile } from "iconsax-react"

export function VotingSkeleton() {
  return (
    <CardSkeleton
      footer={
        <p className="text-sm text-gray-600">
          A votação se encerra em <span className="font-semibold">16 horas</span>
        </p>
      }
    >
      <Card.Row>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2">
              <Profile size={28} variant="Bulk" />
            </div>
            <span className="text-lg font-medium">aute deserunt ut</span>
          </div>
          <Button disabled variant="secondary">
            Votar
          </Button>
        </div>
      </Card.Row>

      <Card.Row>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gray-100 p-2">
              <Profile size={28} variant="Bulk" />
            </div>
            <span className="text-lg font-medium">voluptate id incididunt</span>
          </div>
          <Button disabled variant="secondary">
            Votar
          </Button>
        </div>
      </Card.Row>
    </CardSkeleton>
  )
}
