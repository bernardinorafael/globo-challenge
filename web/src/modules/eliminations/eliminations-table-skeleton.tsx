import { Badge } from "@/src/components/badge"
import * as Table from "@/src/components/data-table"
import { TableSkeleton, type TableSkeletonProps } from "@/src/components/table-skeleton"
import { format, formatDistanceToNow } from "date-fns"
import { Profile2User } from "iconsax-react"

export function EliminationsTableSkeleton(props: Pick<TableSkeletonProps, "head">) {
  const formatDate = (date: Date) => {
    return format(date, "PP")
  }

  return (
    <TableSkeleton head={props.head}>
      {Array.from({ length: 5 }, (_, i) => (
        <Table.Row key={i}>
          <Table.Cell>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gray-100 p-2.5">
                <Profile2User size={22} variant="Bulk" />
              </div>
              <span className="font-medium">John Doe / Jane Doe</span>
            </div>
          </Table.Cell>

          <Table.Cell>
            {formatDate(new Date())} / {formatDate(new Date())}
          </Table.Cell>

          <Table.Cell>
            {formatDistanceToNow(new Date(), {
              addSuffix: true,
            })}
          </Table.Cell>

          <Table.Cell>
            <Badge intent="danger">Fechado</Badge>
          </Table.Cell>
        </Table.Row>
      ))}
    </TableSkeleton>
  )
}
