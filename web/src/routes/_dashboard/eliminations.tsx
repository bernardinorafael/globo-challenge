import { useState } from "react"

import { Badge } from "@/src/components/badge"
import { Button } from "@/src/components/button"
import * as Table from "@/src/components/data-table"
import { EmptyState } from "@/src/components/empty-state"
import { PageLayout } from "@/src/components/layout/page-layout"
import { CreateEliminationDialog } from "@/src/modules/eliminations/create-elimination-dialog"
import { EliminationsTableSkeleton } from "@/src/modules/eliminations/eliminations-table-skeleton"
import type { Elimination } from "@/src/types"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { formatDistanceToNow } from "date-fns"
import { format } from "date-fns/format"
import { ptBR } from "date-fns/locale"
import { Profile2User } from "iconsax-react"
import { Users2 } from "lucide-react"
import { toast } from "sonner"

function RouteComponent() {
	const [open, setOpen] = useState(false)
	const query = useQueryClient()

	const { data: eliminations, isLoading: isLoadingEliminations } = useQuery({
		queryKey: ["eliminations"],
		queryFn: () => {
			return request<Elimination[]>({
				path: "api/v1/eliminations",
				method: "GET",
			})
		},
	})

	// TODO: add a alert dialog to confirm the action
	const { mutate: closeElimination } = useMutation({
		mutationFn: (eliminationId: string) => {
			return request<Elimination>({
				path: `api/v1/eliminations/${eliminationId}/finish`,
				method: "PATCH",
			})
		},
		onMutate: async (eliminationId) => {
			await query.cancelQueries({ queryKey: ["eliminations"] })
			const previous = query.getQueryData<Elimination[]>(["eliminations"])

			query.setQueryData(["eliminations"], (old: Elimination[]) => {
				return old.map((elimination) => {
					if (elimination.id === eliminationId) {
						return {
							...elimination,
							open: false,
							participants: [],
						}
					}
					return elimination
				})
			})

			return {
				previous,
			}
		},
		onError: (err, _, context) => {
			if (context) {
				query.setQueryData(["eliminations"], context.previous)
			}
			if (isHTTPError(err)) {
				toast.error("Erro ao encerrar paredão")
				return
			}
		},
		onSettled: () => {
			query.invalidateQueries({ queryKey: ["eliminations"] })
			query.invalidateQueries({ queryKey: ["eliminations-open"] })
			query.invalidateQueries({ queryKey: ["participants"] })
		},
	})

	const formatDate = (date: Date) => {
		return format(date, "PP", {
			locale: ptBR,
		})
	}

	const hasEliminations = Boolean(eliminations?.length)

	return (
		<>
			<PageLayout
				title="Paredões"
				description="proident eu ipsum esse cillum sunt exercitation nostrud cillum adipisicing elit amet et ipsum"
				actions={
					<Button variant="primary" onClick={() => setOpen(true)}>
						Novo paredão
					</Button>
				}
			>
				{isLoadingEliminations ? (
					<EliminationsTableSkeleton
						head={[
							{ label: "Participantes" },
							{ label: "Data de início/término", width: "25%" },
							{ label: "Tempo restante", width: "25%" },
							{ label: "Status", width: "10%", omit: true },
						]}
					/>
				) : (
					<Table.Root>
						<Table.Head>
							<Table.Row>
								<Table.Header>Participantes</Table.Header>
								<Table.Header width="25%">Data de início/término</Table.Header>
								<Table.Header width="25%">Tempo restante</Table.Header>
								<Table.Header width="10%" omit>
									Status
								</Table.Header>
							</Table.Row>
						</Table.Head>
						<Table.Body>
							{hasEliminations ? (
								eliminations?.map((e) => (
									<Table.Row key={e.id}>
										<Table.Cell>
											<div className="flex items-center gap-3">
												<div className="rounded-full bg-gray-100 p-2.5">
													<Profile2User size={22} variant="Bulk" />
												</div>
												<span className="font-medium">
													{e.participants.length
														? e.participants.map((p) => p.name).join(" / ")
														: "-"}
												</span>
											</div>
										</Table.Cell>

										<Table.Cell>
											{formatDate(e.start_date)} / {formatDate(e.end_date)}
										</Table.Cell>

										<Table.Cell>
											{formatDistanceToNow(e.end_date, { locale: ptBR })}
										</Table.Cell>

										<Table.Cell>
											{e.open ? (
												<Button
													size="sm"
													variant="secondary"
													onClick={() => closeElimination(e.id)}
												>
													Encerrar
												</Button>
											) : (
												<Badge intent="danger">Fechado</Badge>
											)}
										</Table.Cell>
									</Table.Row>
								))
							) : (
								<Table.Cell colSpan={4}>
									<EmptyState
										title="Nenhum paredão encontrado"
										description="Crie um paredão para começar a visualizar os resultados"
										icon={Users2}
									/>
								</Table.Cell>
							)}
						</Table.Body>
					</Table.Root>
				)}
			</PageLayout>

			<CreateEliminationDialog open={open} onOpenChange={setOpen} />
		</>
	)
}

export const Route = createFileRoute("/_dashboard/eliminations")({
	component: RouteComponent,
})
