import * as Card from "@/src/components/card"
import { CardSkeleton } from "@/src/components/card-skeleton"
import { BarChartComponent } from "@/src/components/charts/bar-chart"
import { ChartAreaIcon, TrendingUp, Users2 } from "lucide-react"

export function DashboardSkeleton() {
	return (
		<div className="grid gap-5">
			<div className="grid grid-cols-3 gap-3">
				<CardSkeleton spacing="compact">
					<Card.Row className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-gray-100 p-2.5">
								<TrendingUp size={18} className="text-gray-600" />
							</div>
							<Card.Title>Total de votos</Card.Title>
						</div>

						<p className="text-2xl font-semibold">1900</p>
					</Card.Row>
				</CardSkeleton>

				<CardSkeleton spacing="compact">
					<Card.Row className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-gray-100 p-2.5">
								<Users2 size={18} className="text-gray-600" />
							</div>
							<Card.Title>Usuários que votaram</Card.Title>
						</div>

						<p className="text-2xl font-semibold">4150</p>
					</Card.Row>
				</CardSkeleton>

				<CardSkeleton spacing="compact">
					<Card.Row className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="rounded-full bg-gray-100 p-2.5">
								<ChartAreaIcon size={18} className="text-gray-600" />
							</div>
							<Card.Title>Votos por hora/média</Card.Title>
						</div>

						<p className="text-2xl font-semibold">1200</p>
					</Card.Row>
				</CardSkeleton>
			</div>

			<CardSkeleton
				spacing="compact"
				title="Total de votos"
				description="Total de votos registrados no sistema"
			>
				<Card.Row className="py-2">
					<BarChartComponent
						shouldAnimate={false}
						data={[
							{ hour: 0, votes: 1 },
							{ hour: 1, votes: 59 },
							{ hour: 2, votes: 19 },
							{ hour: 3, votes: 97 },
							{ hour: 4, votes: 12 },
							{ hour: 5, votes: 46 },
							{ hour: 6, votes: 83 },
							{ hour: 7, votes: 10 },
							{ hour: 8, votes: 35 },
							{ hour: 9, votes: 27 },
							{ hour: 10, votes: 64 },
							{ hour: 11, votes: 24 },
							{ hour: 12, votes: 22 },
							{ hour: 13, votes: 76 },
							{ hour: 14, votes: 19 },
							{ hour: 15, votes: 18 },
							{ hour: 16, votes: 62 },
							{ hour: 17, votes: 61 },
							{ hour: 18, votes: 20 },
							{ hour: 19, votes: 96 },
							{ hour: 20, votes: 14 },
							{ hour: 21, votes: 51 },
							{ hour: 22, votes: 83 },
							{ hour: 23, votes: 78 },
						]}
					/>
				</Card.Row>
			</CardSkeleton>
		</div>
	)
}
