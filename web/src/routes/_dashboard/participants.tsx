import { useState } from "react"

import { Badge } from "@/src/components/badge"
import { Button } from "@/src/components/button"
import * as Table from "@/src/components/data-table"
import { EmptyState } from "@/src/components/empty-state"
import { PageLayout } from "@/src/components/layout/page-layout"
import { CreateParticipantDialog } from "@/src/modules/participants/components/create-participant-dialog"
import { ParticipantsTableSkeleton } from "@/src/modules/participants/components/participants-table-skeleton"
import type { Participant } from "@/src/types"
import { getQueryClient } from "@/src/util/get-query-client"
import { isHTTPError } from "@/src/util/http/http-error"
import { request } from "@/src/util/http/request"
import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Profile } from "iconsax-react"
import { User } from "lucide-react"
import { toast } from "sonner"

function RouteComponent() {
  const query = getQueryClient()
  const [open, setOpen] = useState(false)

  const { data: participants, isLoading: isLoadingParticipants } = useQuery({
    queryKey: ["participants"],
    queryFn: () => {
      return request<Participant[]>({
        path: "api/v1/participants",
        method: "GET",
      })
    },
  })

  const { mutate: deleteParticipant } = useMutation({
    mutationFn: (participantId: string) => {
      return request({
        path: `api/v1/participants/${participantId}`,
        method: "DELETE",
      })
    },
    onMutate: async (participantId) => {
      await query.cancelQueries({ queryKey: ["participants"] })

      const previous = query.getQueryData<Participant[]>(["participants"])
      const participantToDelete = previous?.find((p) => p.id === participantId)

      query.setQueryData(["participants"], (participants: Participant[]) => {
        return participants.filter((p) => p.id !== participantId)
      })

      return {
        previous,
        // Get the first name of the participant
        participantName: participantToDelete?.name.split(" ")[0],
      }
    },
    onError: (err, _, context) => {
      if (context) {
        query.setQueryData(["participants"], context.previous)
        toast.error("Erro ao deletar participante")
        return
      }
      if (isHTTPError(err)) {
        toast.error("Erro ao deletar participante")
        return
      }
    },
    onSettled: async (_, __, ___, context) => {
      await query.invalidateQueries({ queryKey: ["participants"] })
      toast.success(`Participante ${context?.participantName} deletado com sucesso`)
    },
  })

  return (
    <>
      <PageLayout
        title="Participantes"
        titleBadge={<Badge intent="secondary">{participants?.length ?? 0}/8</Badge>}
        description="cupidatat aute excepteur amet minim enim eiusmod irure ea esse mollit deserunt"
        actions={
          <Button variant="primary" onClick={() => setOpen(true)}>
            Novo participante
          </Button>
        }
      >
        {isLoadingParticipants ? (
          <ParticipantsTableSkeleton
            head={[
              { label: "Nome", width: "40%" },
              { label: "Criado em" },
              { label: "Status" },
              { label: "Ações", omit: true, width: "10%" },
            ]}
          />
        ) : (
          <Table.Root>
            <Table.Head>
              <Table.Row>
                <Table.Header width="40%">Nome</Table.Header>
                <Table.Header>Criado em</Table.Header>
                <Table.Header>Status</Table.Header>
                <Table.Header omit width="10%">
                  Ações
                </Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {participants?.length === 0 ? (
                <Table.Cell colSpan={4}>
                  <EmptyState
                    title="Nenhum participante encontrado"
                    description="Crie um participante para começar a usar o Paredão"
                    icon={User}
                  />
                </Table.Cell>
              ) : (
                participants?.map((participant) => (
                  <Table.Row key={participant.id}>
                    <Table.Cell>
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-gray-100 p-2">
                          <Profile size={18} variant="Bulk" />
                        </div>
                        <span className="font-medium">{participant.name}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      {format(participant.created, "PPP", { locale: ptBR })}
                    </Table.Cell>
                    <Table.Cell>
                      {participant.elimination_id ? (
                        <Badge intent="danger">Em paredão</Badge>
                      ) : (
                        <Badge intent="success">Disponível</Badge>
                      )}
                    </Table.Cell>
                    <Table.Cell>
                      <Table.Actions>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            // TODO: Add this validation to the backend
                            if (participant.elimination_id) {
                              toast.error("Este participante está em um paredão")
                              return
                            }
                            deleteParticipant(participant.id)
                          }}
                        >
                          Deletar
                        </Button>
                      </Table.Actions>
                    </Table.Cell>
                  </Table.Row>
                ))
              )}
            </Table.Body>
          </Table.Root>
        )}
      </PageLayout>

      <CreateParticipantDialog open={open} onOpenChange={setOpen} />
    </>
  )
}

export const Route = createFileRoute("/_dashboard/participants")({
  component: RouteComponent,
})
