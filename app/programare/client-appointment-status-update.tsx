// app/programare/client-appointment-status-update.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { updateAppointmentStatus } from './actions/update-appointment-status';
import { useToast } from "@/components/ui/use-toast";

type ClientAppointmentStatusUpdateProps = {
  appointmentId: string;
  currentStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID' | 'COMPLETED';
};

export function ClientAppointmentStatusUpdate({ appointmentId, currentStatus }: ClientAppointmentStatusUpdateProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConfirm = async () => {
    if (currentStatus !== 'PENDING') {
      toast({
        title: "Acțiune nepermisă",
        description: "Puteți confirma doar programările în așteptare.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await updateAppointmentStatus(appointmentId, 'CONFIRMED');
      toast({
        title: "Programare confirmată",
        description: "Programarea dvs. a fost confirmată cu succes.",
      });
      // You might want to refresh the page or update the UI here
      window.location.reload();
    } catch (error) {
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare la confirmarea programării.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus !== 'PENDING') {
    return <span className="text-sm font-medium">{currentStatus}</span>;
  }

  return (
    <Button onClick={handleConfirm} disabled={isLoading}>
      {isLoading ? "Se procesează..." : "Confirmă programarea"}
    </Button>
  );
}