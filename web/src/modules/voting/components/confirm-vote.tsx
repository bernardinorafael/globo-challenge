import { useMemo } from "react"

import { Button } from "@/src/components/button"
import * as Card from "@/src/components/card"
import { PageLayout } from "@/src/components/layout/page-layout"
import { VotingResultSkeleton } from "@/src/modules/eliminations/voting-result-skeleton"
import { cn } from "@/src/util/cn"
import { request } from "@/src/util/http/request"
import { useQuery } from "@tanstack/react-query"
import { Profile } from "iconsax-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { parseAsBoolean, useQueryState } from "nuqs"

type ParticipantResult = {
	id: string
	name: string
	count: number
}

export function ConfirmVote(props: { eliminationId: string }) {
	const [voted, setVoted] = useQueryState("voted", parseAsBoolean.withDefault(false))

	const { data: result, isFetching: isLoadingResult } = useQuery<ParticipantResult[]>({
		queryKey: ["result", props.eliminationId],
		queryFn: () => {
			return request({
				path: `api/v1/eliminations/${props.eliminationId}/result`,
				method: "GET",
			})
		},
		enabled: voted,
	})

	const totalVotes = useMemo(() => {
		if (!result) return 0
		return result.reduce((curr, acc) => curr + acc.count, 0)
	}, [result])

	const maxVotes = result ? Math.max(...result.map((p) => p.count)) : 0

	return (
		<PageLayout
			title="Votação realizada com sucesso"
			description="Veja o resultado da votação"
			actions={
				<Button size="sm" variant="secondary" onClick={() => setVoted(false)}>
					Votar novamente
				</Button>
			}
		>
			{isLoadingResult ? (
				<VotingResultSkeleton />
			) : (
				<div className="grid gap-2">
					{result?.map((participant) => (
						<Card.Root key={participant.id}>
							<Card.Body>
								<Card.Row>
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-3">
											<div className="rounded-full bg-gray-100 p-2.5">
												<Profile size={18} variant="Bulk" />
											</div>
											<span className="font-medium">{participant.name}</span>
										</div>

										<div
											className={cn(
												"flex items-center gap-2 text-base font-semibold",
												participant.count === maxVotes ? "text-green-600" : "text-red-600"
											)}
										>
											{participant.count === maxVotes ? (
												<TrendingUp size={18} />
											) : (
												<TrendingDown size={18} />
											)}

											<div className="flex items-center gap-1">
												<span>{participant.count} votos</span>
												<span>/</span>
												<span>{Math.round((participant.count / totalVotes) * 100)}%</span>
											</div>
										</div>
									</div>
								</Card.Row>
							</Card.Body>
						</Card.Root>
					))}
				</div>
			)}
		</PageLayout>
	)
}
