// app/programari/[id]/appointment-status-update.tsx
'use client';

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateAppointmentStatus } from '../actions/update-appointment-status';
import { useToast } from "@/components/ui/use-toast";

type AppointmentStatusUpdateProps = {
  appointmentId: string;
  currentStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID';
};

export function AppointmentStatusUpdate({ appointmentId, currentStatus }: AppointmentStatusUpdateProps) {
  const [status, setStatus] = useState(currentStatus);
  const { toast } = useToast();

  const handleStatusChange = async (newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID') => {
    try {
      await updateAppointmentStatus(appointmentId, newStatus);
      setStatus(newStatus);
      toast({
        title: "Status actualizat",
        description: "Statusul programării a fost actualizat cu succes.",
      });
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea statusului. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
  };

  return (
    <Select onValueChange={handleStatusChange} defaultValue={status}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">În așteptare</SelectItem>
        <SelectItem value="CONFIRMED">Confirmată</SelectItem>
        <SelectItem value="CANCELLED">Anulată</SelectItem>
        <SelectItem value="PAID">Plătită</SelectItem>
      </SelectContent>
    </Select>
  );
}