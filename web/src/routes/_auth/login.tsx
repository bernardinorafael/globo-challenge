import { useRef, useState } from "react"

import { Button } from "@/src/components/button"
import * as Card from "@/src/components/card"
import { CustomLink } from "@/src/components/custom-link"
import { Field } from "@/src/components/field"
import { Input } from "@/src/components/input"
import { LogoIcon } from "@/src/components/logo-icon"
import { ErrCodes, TokenKeys } from "@/src/enums"
import { env } from "@/src/env"
import { getCookie, setCookie } from "@/src/util/cookies"
import { getQueryClient } from "@/src/util/get-query-client"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { sleep } from "@/src/util/sleep"
import { zodResolver } from "@hookform/resolvers/zod"
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile"
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
  email: z
    .string({ required_error: "E-mail é um campo obrigatório" })
    .email("Insira um e-mail válido"),
  password: z
    .string({ required_error: "Senha é um campo obrigatório" })
    .min(4, "A senha deve conter pelo menos 4 caracteres"),
})

function RouteComponent() {
  const widgetRef = useRef<TurnstileInstance | null>(null)
  const [isTurnstileVerified, setIsTurnstileVerified] = useState(false)

  const query = getQueryClient()
  const navigate = useNavigate({ from: "/login" })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  // TODO: Add login logic to a store(zustand or context api)
  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    if (!isTurnstileVerified) return
    try {
      // Simulates a loading state for improved user experience
      await sleep(350)

      const { access_token } = await request<{
        access_token: string
      }>({
        path: "api/v1/auth/login",
        method: "POST",
        data: {
          email: data.email,
          password: data.password,
        },
      })

      setCookie({
        name: TokenKeys.AccessToken,
        value: access_token,
      })

      await query.invalidateQueries({ queryKey: ["me"] })
      navigate({ to: "/" })
    } catch (err) {
      if (isHTTPError(err)) {
        if (err.code === ErrCodes.InvalidCredentials) {
          toast.error("E-mail e/ou senha inválidos")
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

        <span className="mb-px text-2xl font-bold">Entrar</span>
      </div>

      <Card.Root className="w-full" spacing="compact">
        <Card.Body>
          <Card.Row>
            <form className="grid gap-4 p-1" onSubmit={form.handleSubmit(onSubmit)}>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Field label="E-mail" message={fieldState.error?.message}>
                    <Input
                      autoFocus
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="exemplo@email.com"
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
                disabled={!isTurnstileVerified}
              >
                {isTurnstileVerified ? "Entrar" : "Verificando..."}
              </Button>
            </form>
          </Card.Row>
        </Card.Body>

        <Card.Footer>
          <div className="flex items-center justify-between">
            <Card.Description>
              Não possui uma conta?{" "}
              <CustomLink to="/register" className="text-accent">
                Criar agora
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

      <Turnstile
        ref={widgetRef}
        siteKey={env.VITE_VERIFY_SITE_KEY}
        options={{ theme: "light", language: "pt-BR" }}
        onSuccess={() => setIsTurnstileVerified(true)}
        onError={() => setIsTurnstileVerified(false)}
        onExpire={() => setIsTurnstileVerified(false)}
      />
    </div>
  )
}

export const Route = createFileRoute("/_auth/login")({
  component: RouteComponent,
  beforeLoad: () => {
    const token = getCookie(TokenKeys.AccessToken)
    if (token) {
      throw redirect({ to: "/" })
    }
  },
})
