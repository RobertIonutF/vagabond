// app/admin/services/delete-service-dialog.tsx
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
import { deleteService } from "./actions/delete-service"
import { useToast } from "@/components/ui/use-toast"

interface DeleteServiceDialogProps {
  serviceId: string
  serviceName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteServiceDialog({ serviceId, serviceName, open, onOpenChange }: DeleteServiceDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function onDelete() {
    setIsLoading(true)
    try {
      await deleteService(serviceId)
      toast({
        title: "Serviciu șters",
        description: "Serviciul a fost șters cu succes.",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la ștergerea serviciului.",
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
          <DialogTitle>Șterge serviciul</DialogTitle>
          <DialogDescription>
            Sunteți sigur că doriți să ștergeți serviciul &quot;{serviceName}&quot;? Această acțiune nu poate fi anulată.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Anulează
          </Button>
          <Button variant="destructive" onClick={onDelete} disabled={isLoading}>
            {isLoading ? "Se șterge..." : "Șterge"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}