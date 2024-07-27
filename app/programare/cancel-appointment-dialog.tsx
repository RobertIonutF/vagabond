/* /app/programare/cancel-appointment-dialog.tsx */
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cancelAppointment } from "./actions/cancel-appointment"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from 'next/navigation'

interface CancelAppointmentDialogProps {
  appointmentId: string
}

export function CancelAppointmentDialog({ appointmentId }: CancelAppointmentDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const result = await cancelAppointment(appointmentId)
      if (result.success) {
        toast({
          title: "Programare anulată",
          description: "Programarea ta a fost anulată cu succes.",
        })
        setIsOpen(false)
        router.refresh() // This will trigger a re-render of the page with fresh data
      } else {
        throw new Error("Nu s-a putut anula programarea. Te rugăm să încerci din nou.")
      }
    } catch (error) {
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "Nu s-a putut anula programarea. Te rugăm să încerci din nou.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive">Anulează programarea</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmă anularea programării</DialogTitle>
          <DialogDescription>
            Ești sigur că vrei să anulezi această programare? Această acțiune nu poate fi anulată.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Anulează</Button>
          <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
            {isLoading ? "Se anulează..." : "Confirmă anularea"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}