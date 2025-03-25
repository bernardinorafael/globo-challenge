import { Badge } from "@/src/components/badge"
import { Button } from "@/src/components/button"
import * as Card from "@/src/components/card"
import { BarChartComponent } from "@/src/components/charts/bar-chart"
import { EmptyState } from "@/src/components/empty-state"
import { PageLayout } from "@/src/components/layout/page-layout"
import { DashboardSkeleton } from "@/src/modules/dashboard/components/dashboard-skeleton"
import { request } from "@/src/util/http/request"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { ChartArea, ChartAreaIcon, TrendingUp, Users2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

type DashboardResult = {
	total_votes: number
	total_users: number
	votes_per_hour: number
	spread_votes: number[]
	has_elimination: boolean
}

function RouteComponent() {
	const {
		data,
		isFetching: isFetchingDashboard,
		isRefetching: isRefetchingDashboard,
		refetch: refetchDashboard,
	} = useQuery({
		queryKey: ["dashboard"],
		queryFn: () => {
			return request<DashboardResult>({
				path: "api/v1/eliminations/dashboard",
				method: "GET",
			})
		},
		refetchInterval: 1000 * 30, // 30 seconds
	})

	const hasActiveElimination = data?.has_elimination

	return (
		<>
			<PageLayout
				title="Dashboard"
				description="Visualize o dashboard de votos e usuários"
				actions={
					<Button
						variant="secondary"
						onClick={() => refetchDashboard()}
						className="disabled:opacity-50"
						disabled={isRefetchingDashboard}
					>
						Atualizar
					</Button>
				}
				titleBadge={
					<AnimatePresence>
						{isRefetchingDashboard && (
							<motion.div
								initial={{ x: -10, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								exit={{ x: -10, opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<Badge intent="warning">Atualizando</Badge>
							</motion.div>
						)}
					</AnimatePresence>
				}
			>
				{isFetchingDashboard && !isRefetchingDashboard ? (
					<DashboardSkeleton />
				) : !hasActiveElimination ? (
					<EmptyState
						withBorder
						icon={ChartArea}
						title="Nenhuma eliminação encontrada"
						description="Crie uma eliminação para visualizar o dashboard"
					/>
				) : (
					<div className="grid gap-5">
						<div className="grid grid-cols-3 gap-3">
							<Card.Root spacing="compact">
								<Card.Body>
									<Card.Row className="flex items-center justify-between">
										<div className="flex w-full items-start justify-between gap-2">
											<div className="flex flex-col">
												<Card.Title>Total de votos</Card.Title>
												<Card.Description>
													Total de votos registrados no sistema
												</Card.Description>
											</div>

											<div className="rounded-full bg-gray-100 p-2">
												<TrendingUp size={18} className="text-gray-600" />
											</div>
										</div>
									</Card.Row>

									<Card.Row>
										<p className="text-2xl font-semibold">{data?.total_votes}</p>
									</Card.Row>
								</Card.Body>
							</Card.Root>

							<Card.Root spacing="compact">
								<Card.Body>
									<Card.Row className="flex items-center justify-between">
										<div className="flex w-full items-start justify-between gap-2">
											<div className="flex flex-col">
												<Card.Title>Total de usuários</Card.Title>
												<Card.Description>
													Total de usuários registrados no sistema
												</Card.Description>
											</div>

											<div className="rounded-full bg-gray-100 p-2">
												<Users2 size={18} className="text-gray-600" />
											</div>
										</div>
									</Card.Row>

									<Card.Row>
										<p className="text-2xl font-semibold">{data?.total_users}</p>
									</Card.Row>
								</Card.Body>
							</Card.Root>

							<Card.Root spacing="compact">
								<Card.Body>
									<Card.Row className="flex items-center justify-between">
										<div className="flex w-full items-start justify-between gap-2">
											<div className="flex flex-col">
												<Card.Title>Média de votos</Card.Title>
												<Card.Description>
													Média de votos registrados no sistema por hora
												</Card.Description>
											</div>

											<div className="rounded-full bg-gray-100 p-2">
												<ChartAreaIcon size={18} className="text-gray-600" />
											</div>
										</div>
									</Card.Row>
									<Card.Row>
										<p className="text-2xl font-semibold">{data?.votes_per_hour}</p>
									</Card.Row>
								</Card.Body>
							</Card.Root>
						</div>

						<Card.Root spacing="compact">
							<Card.Header>
								<Card.Title>Votos por hora</Card.Title>
								<Card.Description>
									Total de votos registrados no sistema por hora
								</Card.Description>
							</Card.Header>

							<Card.Body>
								<Card.Row>
									<BarChartComponent
										data={
											data?.spread_votes.map((el, index) => {
												return { hour: index, votes: el }
											}) ?? []
										}
									/>
								</Card.Row>
							</Card.Body>
						</Card.Root>
					</div>
				)}
			</PageLayout>
		</>
	)
}

export const Route = createFileRoute("/_dashboard/")({
	component: RouteComponent,
})
