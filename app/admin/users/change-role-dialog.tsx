// app/admin/users/change-role-dialog.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { changeUserRole } from "./actions/change-role"
import { useToast } from "@/components/ui/use-toast"
import { User } from "./columns"

interface ChangeRoleDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangeRoleDialog({ user, open, onOpenChange }: ChangeRoleDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const isBarber = user.roles.includes('barber')
  const newRole = isBarber ? 'user' : 'barber'

  async function onChangeRole() {
    setIsLoading(true)
    try {
      await changeUserRole(user.id, newRole)
      toast({
        title: "Rol schimbat",
        description: `Utilizatorul a fost ${isBarber ? 'retrogradat la client' : 'promovat la frizer'}.`,
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la schimbarea rolului.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schimbă rolul utilizatorului</DialogTitle>
          <DialogDescription>
            {isBarber 
              ? "Sunteți sigur că doriți să retrogradați acest frizer la client?" 
              : "Sunteți sigur că doriți să promovați acest client la frizer?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button onClick={onChangeRole} disabled={isLoading}>
            {isLoading ? "Se procesează..." : isBarber ? "Retrogradează la client" : "Promovează la frizer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}