// app/admin/users/columns.tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChangeRoleDialog } from "./change-role-dialog"
import { SuspendUserDialog } from "./suspend-user-dialog"
import { useState } from "react"

export type User = {
  id: string
  name: string
  email: string
  roles: string[]
  isSuspended: boolean
}

const ActionsCell = ({ user }: { user: User }) => {
  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)

  if (user.roles.includes('admin')) {
    return <span className="text-gray-500">N/A</span>
  }

  return (
    <div className="flex space-x-2">
      <Button size="sm" onClick={() => setShowChangeRoleDialog(true)}>
        Schimbă rolul
      </Button>
      <Button 
        size="sm" 
        variant={user.isSuspended ? "outline" : "destructive"}
        onClick={() => setShowSuspendDialog(true)}
      >
        {user.isSuspended ? "Reactivează" : "Suspendă"}
      </Button>
      <ChangeRoleDialog
        user={user}
        open={showChangeRoleDialog}
        onOpenChange={setShowChangeRoleDialog}
      />
      <SuspendUserDialog
        user={user}
        open={showSuspendDialog}
        onOpenChange={setShowSuspendDialog}
      />
    </div>
  )
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nume
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "roles",
    header: "Roluri",
    cell: ({ row }) => {
      const roles = row.getValue("roles") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge key={role} variant="secondary">
              {role}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "isSuspended",
    header: "Status",
    cell: ({ row }) => {
      const isSuspended = row.getValue("isSuspended") as boolean
      return (
        <Badge>
          {isSuspended ? "Suspendat" : "Activ"}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Acțiuni",
    cell: ({ row }) => <ActionsCell user={row.original} />,
  },
]