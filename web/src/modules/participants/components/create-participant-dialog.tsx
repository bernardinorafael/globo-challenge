import { Button } from "@/src/components/button"
import * as Dialog from "@/src/components/dialog"
import type { DialogProps } from "@/src/components/dialog/root"
import { Field } from "@/src/components/field"
import { Input } from "@/src/components/input"
import { ErrCodes } from "@/src/enums"
import { getQueryClient } from "@/src/util/get-query-client"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm, type SubmitHandler } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const formId = "create-participant-form"

const schema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(3, "Nome deve conter pelo menos 3 caracteres"),
  surname: z
    .string({ required_error: "Sobrenome é obrigatório" })
    .min(3, "Sobrenome deve conter pelo menos 3 caracteres"),
})

export function CreateParticipantDialog(
  props: Required<Pick<DialogProps, "open" | "onOpenChange">>
) {
  const query = getQueryClient()

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  })

  const onChangeDialog = (open: boolean) => {
    form.reset({ name: "", surname: "" })
    props.onOpenChange(open)
  }

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    try {
      await request({
        path: "api/v1/participants",
        method: "POST",
        data: {
          name: `${data.name} ${data.surname}`,
        },
      })

      await query.invalidateQueries({ queryKey: ["participants"] })
      toast.success("Participante criado com sucesso")
      onChangeDialog(false)
    } catch (err) {
      if (isHTTPError(err)) {
        if (err.code === ErrCodes.ResourceAlreadyTaken) {
          form.setError("name", {
            message: "Já existe um participante com este nome",
          })
          return
        }
        if (err.code === ErrCodes.LimitReached) {
          onChangeDialog(false)
          toast.error("Você atingiu o limite de participantes")
          return
        }
        toast.error("Algo inesperado aconteceu, tente novamente mais tarde")
      }
    }
  }

  return (
    <Dialog.Root size="sm" open={props.open} onOpenChange={onChangeDialog}>
      <Dialog.Header title="Adicionar participante" />

      <Dialog.Content>
        <Dialog.Section>
          <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field label="Nome" message={fieldState.error?.message}>
                  <Input
                    autoFocus
                    size="md"
                    placeholder="Nome do participante"
                    onChange={field.onChange}
                    value={field.value}
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
                    size="md"
                    placeholder="Sobrenome do participante"
                    onChange={field.onChange}
                    value={field.value}
                  />
                </Field>
              )}
            />
          </form>
        </Dialog.Section>
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.Close disabled={form.formState.isSubmitting}>Cancelar</Dialog.Close>
        <Button
          type="submit"
          form={formId}
          variant="primary"
          loading={form.formState.isSubmitting}
        >
          Adicionar
        </Button>
      </Dialog.Footer>
    </Dialog.Root>
  )
}
