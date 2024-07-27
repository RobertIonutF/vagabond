// app/admin/users/suspend-user-dialog.tsx
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
import { suspendUser } from "./actions/suspend-user"
import { useToast } from "@/components/ui/use-toast"
import { User } from "./columns"

interface SuspendUserDialogProps {
  user: User
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SuspendUserDialog({ user, open, onOpenChange }: SuspendUserDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onSuspendUser() {
    setIsLoading(true)
    try {
      await suspendUser(user.id, !user.isSuspended)
      toast({
        title: user.isSuspended ? "Utilizator reactivat" : "Utilizator suspendat",
        description: user.isSuspended 
          ? "Utilizatorul a fost reactivat cu succes." 
          : "Utilizatorul a fost suspendat cu succes.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la suspendarea/reactivarea utilizatorului.",
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
          <DialogTitle>
            {user.isSuspended ? "Reactivează utilizatorul" : "Suspendă utilizatorul"}
          </DialogTitle>
          <DialogDescription>
            {user.isSuspended
              ? "Sunteți sigur că doriți să reactivați acest utilizator?"
              : "Sunteți sigur că doriți să suspendați acest utilizator?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button 
            onClick={onSuspendUser} 
            disabled={isLoading}
            variant={user.isSuspended ? "default" : "destructive"}
          >
            {isLoading ? "Se procesează..." : user.isSuspended ? "Reactivează" : "Suspendă"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}