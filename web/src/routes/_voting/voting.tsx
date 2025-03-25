import { Button } from "@/src/components/button"
import * as Card from "@/src/components/card"
import { EmptyState } from "@/src/components/empty-state"
import { PageLayout } from "@/src/components/layout/page-layout"
import { ErrCodes } from "@/src/enums"
import { VotingSkeleton } from "@/src/modules/eliminations/voting-skeleton"
import { ConfirmVote } from "@/src/modules/voting/components/confirm-vote"
import type { Elimination } from "@/src/types"
import { cn } from "@/src/util/cn"
import { getQueryClient } from "@/src/util/get-query-client"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Profile } from "iconsax-react"
import { Users2 } from "lucide-react"
import { parseAsBoolean, useQueryState } from "nuqs"
import { toast } from "sonner"

function RouteComponent() {
	const query = getQueryClient()
	const navigate = useNavigate({ from: "/voting" })

	const [voted, setVoted] = useQueryState("voted", parseAsBoolean.withDefault(false))

	const { data: eliminations, isFetching: isLoadingEliminations } = useQuery({
		queryKey: ["eliminations-open"],
		queryFn: () => {
			return request<Elimination[]>({
				path: "api/v1/eliminations/open",
				method: "GET",
			})
		},
	})

	const {
		mutateAsync: handleVoteParticipant,
		isPending: isVoting,
		variables: participantId,
	} = useMutation({
		mutationFn: (participantId: string) => {
			return request({
				path: `api/v1/eliminations/${elimination?.id}/vote`,
				method: "POST",
				data: {
					participant_id: participantId,
				},
			})
		},
		onSuccess: async () => {
			await Promise.all([
				query.invalidateQueries({ queryKey: ["result", elimination?.id] }),
				query.invalidateQueries({ queryKey: ["dashboard"] }),
			])
			setVoted(true)
		},
		onError: (err) => {
			if (isHTTPError(err)) {
				if (err.code === ErrCodes.CaptchaNotVerified) {
					toast.error("Captcha não verificado")
					return
				}
				if (err.code === ErrCodes.Unauthorized) {
					toast.error("Você precisa estar logado para votar")
					navigate({ to: "/login" })
					return
				}
				toast.error("Algo inesperado aconteceu, tente novamente mais tarde")
			}
		},
	})

	const hasEliminations = Boolean(eliminations?.length)
	const elimination = hasEliminations ? eliminations?.[0] : null

	return voted ? (
		<ConfirmVote eliminationId={elimination?.id as string} />
	) : (
		<PageLayout
			title="Qual participante você quer eliminar?"
			description="Selecione um participante para eliminar do BBB 25"
		>
			{isLoadingEliminations ? (
				<VotingSkeleton />
			) : !hasEliminations ? (
				<EmptyState
					withBorder
					title="Nenhum paredão encontrado"
					description="Volte quando houver um paredão para começar a votação"
					icon={Users2}
				/>
			) : (
				<div className="space-y-3">
					<Card.Root>
						<Card.Body>
							{elimination?.participants.map((p) => (
								<Card.Row key={p.id}>
									<div className="flex items-center justify-between gap-3">
										<div className="flex items-center gap-3">
											<div className="rounded-full bg-gray-100 p-2">
												<Profile size={28} variant="Bulk" />
											</div>
											<span className="text-lg font-medium">{p.name}</span>
										</div>
										<Button
											className={cn(isVoting && participantId === p.id && "opacity-50")}
											variant="secondary"
											onClick={() => handleVoteParticipant(p.id)}
											disabled={isVoting && participantId === p.id}
										>
											Votar
										</Button>
									</div>
								</Card.Row>
							))}
						</Card.Body>

						<Card.Footer>
							<p className="text-sm text-gray-600">
								A votação se encerra{" "}
								<span className="font-semibold">
									{formatDistanceToNow(elimination?.end_date as Date, {
										addSuffix: true,
										locale: ptBR,
									})}
								</span>
							</p>
						</Card.Footer>
					</Card.Root>
				</div>
			)}
		</PageLayout>
	)
}

export const Route = createFileRoute("/_voting/voting")({
	component: RouteComponent,
})
