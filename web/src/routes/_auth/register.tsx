import { Button } from "@/src/components/button"
import * as Card from "@/src/components/card"
import { CustomLink } from "@/src/components/custom-link"
import { Field } from "@/src/components/field"
import { Input } from "@/src/components/input"
import { LogoIcon } from "@/src/components/logo-icon"
import { ErrCodes, TokenKeys } from "@/src/enums"
import { getCookie } from "@/src/util/cookies"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { sleep } from "@/src/util/sleep"
import { zodResolver } from "@hookform/resolvers/zod"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
	name: z.string({ required_error: "Nome é um campo obrigatório" }),
	surname: z.string({ required_error: "Sobrenome é um campo obrigatório" }),
	email: z
		.string({ required_error: "E-mail é um campo obrigatório" })
		.email("Insira um e-mail válido"),
	password: z
		.string({ required_error: "Senha é um campo obrigatório" })
		.min(4, "A senha deve conter pelo menos 4 caracteres"),
})

function RouteComponent() {
	const navigate = useNavigate({ from: "/register" })

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
	})

	// TODO: Add login logic to a store(zustand or context api)
	const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
		try {
			// Simulates a loading state for improved user experience
			await sleep(350)

			await request({
				method: "POST",
				path: "api/v1/auth/register",
				data: {
					name: `${data.name} ${data.surname}`,
					email: data.email,
					password: data.password,
				},
			})

			await navigate({ to: "/login" })
			toast.success("A sua conta foi criada com sucesso")
		} catch (err) {
			if (isHTTPError(err)) {
				if (err.code === ErrCodes.ResourceAlreadyTaken) {
					form.setError("email", { message: "Este e-mail já está associado a uma conta" })
					return
				}
				toast.error("Algo inesperado aconteceu, tente novamente mais tarde")
			}
		}
	}

	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex items-center gap-1">
				<LogoIcon className="fill-accent" />

				<svg
					width="16"
					height="24"
					viewBox="0 0 16 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M14 2L2 30"
						className="stroke-zinc-300"
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
					/>
				</svg>

				<span className="mb-px text-2xl font-bold">Criar conta</span>
			</div>

			<Card.Root className="w-full" spacing="compact">
				<Card.Body>
					<Card.Row>
						<form className="grid gap-4 p-1" onSubmit={form.handleSubmit(onSubmit)}>
							<div className="grid grid-cols-2 gap-4">
								<Controller
									control={form.control}
									name="name"
									render={({ field, fieldState }) => (
										<Field label="Nome" message={fieldState.error?.message}>
											<Input
												autoFocus
												value={field.value}
												onChange={field.onChange}
												placeholder="Digite seu nome"
												size="md"
											/>
										</Field>
									)}
								/>
								<Controller
									control={form.control}
									name="surname"
									render={({ field, fieldState }) => (
										<Field label="Sobrenome" message={fieldState.error?.message}>
											<Input
												value={field.value}
												onChange={field.onChange}
												placeholder="Digite seu sobrenome"
												size="md"
											/>
										</Field>
									)}
								/>
							</div>

							<Controller
								control={form.control}
								name="email"
								render={({ field, fieldState }) => (
									<Field label="E-mail" message={fieldState.error?.message}>
										<Input
											value={field.value}
											onChange={field.onChange}
											placeholder="seu-email@email.com"
											size="md"
										/>
									</Field>
								)}
							/>

							<Controller
								control={form.control}
								name="password"
								render={({ field, fieldState }) => (
									<Field
										label="Senha"
										message={fieldState.error?.message}
										description="A senha deve conter pelo menos 4 caracteres"
									>
										<Input
											type="password"
											value={field.value}
											onChange={field.onChange}
											placeholder="********"
											size="md"
										/>
									</Field>
								)}
							/>

							<Button
								full
								type="submit"
								className="mt-3 h-10"
								variant="primary"
								loading={form.formState.isSubmitting}
							>
								Entrar
							</Button>
						</form>
					</Card.Row>
				</Card.Body>

				<Card.Footer>
					<div className="flex items-center justify-between">
						<Card.Description>
							Já possui uma conta?{" "}
							<CustomLink to="/login" className="text-accent">
								Entrar
							</CustomLink>
						</Card.Description>

						<Card.Description>
							<CustomLink to="/voting" className="text-accent">
								Ver votações
							</CustomLink>
						</Card.Description>
					</div>
				</Card.Footer>
			</Card.Root>
		</div>
	)
}

export const Route = createFileRoute("/_auth/register")({
	component: RouteComponent,
	beforeLoad: () => {
		const token = getCookie(TokenKeys.AccessToken)
		if (token) {
			throw redirect({ to: "/" })
		}
	},
})
