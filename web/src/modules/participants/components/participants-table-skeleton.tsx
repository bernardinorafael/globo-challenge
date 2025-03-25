import { Badge } from "@/src/components/badge"
import { Button } from "@/src/components/button"
import * as Table from "@/src/components/data-table"
import { TableSkeleton, type TableSkeletonProps } from "@/src/components/table-skeleton"
import { format } from "date-fns"
import { Profile } from "iconsax-react"

export function ParticipantsTableSkeleton(props: Pick<TableSkeletonProps, "head">) {
  return (
    <TableSkeleton head={props.head}>
      {Array.from({ length: 5 }, (_, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2">
                <Profile size={18} variant="Bulk" />
              </div>
              <span className="font-medium">John doe</span>
            </div>
          </Table.Cell>
          <Table.Cell>{format(new Date(), "PPP")}</Table.Cell>
          <Table.Cell>
            <Badge intent="secondary">Em paredão</Badge>
          </Table.Cell>
          <Table.Cell>
            <Table.Actions>
              <Button disabled size="sm" variant="secondary">
                Deletar
              </Button>
            </Table.Actions>
          </Table.Cell>
        </Table.Row>
      ))}
    </TableSkeleton>
  )
}
