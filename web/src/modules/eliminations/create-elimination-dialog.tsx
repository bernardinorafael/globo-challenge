import { Button } from "@/src/components/button"
import * as Dialog from "@/src/components/dialog"
import type { DialogProps } from "@/src/components/dialog/root"
import { Field } from "@/src/components/field"
import { Select } from "@/src/components/select"
import { ErrCodes } from "@/src/enums"
import type { Participant } from "@/src/types"
import { getQueryClient } from "@/src/util/get-query-client"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formId = "create-elimination-form"

const schema = z
	.object({
		participantA: z.string().min(1, "Selecione um participante"),
		participantB: z.string().min(1, "Selecione um participante"),
	})
	.refine((data) => data.participantA !== data.participantB, {
		message: "Os participantes não podem ser iguais",
		path: ["participantB"],
	})

export function CreateEliminationDialog(
	props: Required<Pick<DialogProps, "open" | "onOpenChange">>
) {
	const query = getQueryClient()

	const { data: participants, isLoading: isLoadingParticipants } = useQuery({
		queryKey: ["participants"],
		queryFn: () => {
			return request<Participant[]>({
				path: "api/v1/participants",
				method: "GET",
			})
		},
	})

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			participantA: "",
			participantB: "",
		},
	})

	const onChangeDialog = (open: boolean) => {
		form.reset()
		props.onOpenChange(open)
	}

	// TODO: block submission if there is already an ongoing elimination
	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
		try {
			await request({
				path: "api/v1/eliminations",
				method: "POST",
				data: {
					participants: [data.participantA, data.participantB],
				},
			})

			await Promise.all([
				query.invalidateQueries({ queryKey: ["eliminations"] }),
				query.invalidateQueries({ queryKey: ["participants"] }),
				query.invalidateQueries({ queryKey: ["eliminations-open"] }),
			])

			toast.success("Eliminação adicionada com sucesso")
			onChangeDialog(false)
		} catch (err) {
			if (isHTTPError(err)) {
				if (err.code === ErrCodes.LimitReached) {
					onChangeDialog(false)
					toast.error("Você atingiu o limite de paredões ativos")
					return
				}
				toast.error("Algo inesperado aconteceu, tente novamente mais tarde")
			}
		}
	}

	const isAllowedToCreateElimination = !!participants && participants.length >= 2

	return (
		<Dialog.Root open={props.open} onOpenChange={onChangeDialog}>
			<Dialog.Header
				title="Adicionar eliminação"
				description="Insira os participantes que serão eliminados"
			/>

			<Dialog.Content>
				{isAllowedToCreateElimination && (
					<Dialog.Section>
						<form
							id={formId}
							className="space-y-4"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<Controller
								control={form.control}
								name="participantA"
								render={({ field, fieldState }) => (
									<Field label="Participante" message={fieldState.error?.message}>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											loading={isLoadingParticipants}
											items={
												participants?.map((participant) => ({
													label: participant.name,
													value: participant.id,
													disabled: !!participant.elimination_id,
												})) ?? []
											}
										/>
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="participantB"
								render={({ field, fieldState }) => (
									<Field label="Participante" message={fieldState.error?.message}>
										<Select
											value={field.value}
											onValueChange={field.onChange}
											loading={isLoadingParticipants}
											items={
												participants?.map((participant) => ({
													label: participant.name,
													value: participant.id,
													disabled: !!participant.elimination_id,
												})) ?? []
											}
										/>
									</Field>
								)}
							/>
						</form>
					</Dialog.Section>
				)}

				{!isAllowedToCreateElimination ? (
					<Dialog.Notice intent="danger">
						Adicione no mínimo 2 participantes para iniciar uma eliminação
					</Dialog.Notice>
				) : (
					<Dialog.Notice intent="warning">
						Participantes desabilitados já estão participando de outro paredão
					</Dialog.Notice>
				)}
			</Dialog.Content>

			<Dialog.Footer>
				<Dialog.Close disabled={form.formState.isSubmitting}>Cancelar</Dialog.Close>
				<Button
					type="submit"
					form={formId}
					variant="primary"
					disabled={!isAllowedToCreateElimination}
					loading={form.formState.isSubmitting}
				>
					Adicionar
				</Button>
			</Dialog.Footer>
		</Dialog.Root>
	)
}
