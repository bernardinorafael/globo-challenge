import * as Card from "@/src/components/card"
import { CardSkeleton } from "@/src/components/card-skeleton"
import { Profile } from "iconsax-react"
import { TrendingDown } from "lucide-react"

export function VotingResultSkeleton() {
	return (
		<div className="grid gap-2">
			<CardSkeleton>
				<Card.Row>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-3">
							<div className="rounded-full bg-gray-100 p-2.5">
								<Profile size={18} variant="Bulk" />
							</div>
							<span className="font-medium">cupidatat officia</span>
						</div>

						<div className="flex items-center gap-2 text-base font-semibold text-gray-600">
							<TrendingDown size={18} />

							<div className="flex items-center gap-1">
								<span>100 votos</span>
								<span>/</span>
								<span>50%</span>
							</div>
						</div>
					</div>
				</Card.Row>
			</CardSkeleton>

			<CardSkeleton>
				<Card.Row>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-3">
							<div className="rounded-full bg-gray-100 p-2.5">
								<Profile size={18} variant="Bulk" />
							</div>
							<span className="font-medium">exercitation irure</span>
						</div>

						<div className="flex items-center gap-2 text-base font-semibold text-gray-600">
							<TrendingDown size={18} />

							<div className="flex items-center gap-1">
								<span>100 votos</span>
								<span>/</span>
								<span>50%</span>
							</div>
						</div>
					</div>
				</Card.Row>
			</CardSkeleton>
		</div>
	)
}
