// app/programari/appointment-list.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { AppointmentFilters } from './appointment-filters';
import { Badge } from "@/components/ui/badge";
import { startOfDay, endOfDay } from 'date-fns';

type Appointment = {
  id: string;
  date: Date;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID';
  user: {
    name: string;
    email: string;
    phoneNumber: string | null;
  };
};

type FilterOptions = {
  status: 'ALL' | 'PENDING' | 'CONFIRMED' | 'PAID';
  startDate: Date | null;
  endDate: Date | null;
  clientName: string;
};

type AppointmentListProps = {
  appointments: Appointment[];
};

const APPOINTMENTS_PER_PAGE = 10;

export function AppointmentList({ appointments }: AppointmentListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'ALL',
    startDate: null,
    endDate: null,
    clientName: '',
  });

  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      // Status filter
      if (filters.status !== 'ALL' && appointment.status !== filters.status) return false;

      // Date range filter
      if (filters.startDate) {
        const startOfFilterDay = startOfDay(filters.startDate);
        if (appointment.date < startOfFilterDay) return false;
      }
      if (filters.endDate) {
        const endOfFilterDay = endOfDay(filters.endDate);
        if (appointment.date > endOfFilterDay) return false;
      }

      // Client name filter
      if (filters.clientName && !appointment.user.name.toLowerCase().includes(filters.clientName.toLowerCase())) return false;

      return true;
    });
  }, [appointments, filters]);

  const totalPages = Math.ceil(filteredAppointments.length / APPOINTMENTS_PER_PAGE);
  const indexOfLastAppointment = currentPage * APPOINTMENTS_PER_PAGE;
  const indexOfFirstAppointment = indexOfLastAppointment - APPOINTMENTS_PER_PAGE;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-500';
      case 'CONFIRMED': return 'bg-green-500';
      case 'PAID': return 'bg-blue-500';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div>
      <AppointmentFilters onFilterChange={setFilters} />
      <h2 className="text-2xl font-playfair mb-4">Programări</h2>
      {currentAppointments.length === 0 ? (
        <p>Nu există programări care să corespundă criteriilor de filtrare.</p>
      ) : (
        <ul className="space-y-4">
          {currentAppointments.map((appointment) => (
            <li key={appointment.id} className="bg-secondary p-4 rounded-lg flex justify-between items-center">
              <div>
                <p className="font-bold">{appointment.user.name}</p>
                <p>{appointment.date.toLocaleString('ro-RO', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(appointment.status)}>{appointment.status}</Badge>
                <Link href={`/programari/${appointment.id}`}>
                  <Button variant="outline">Vezi detalii</Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center space-x-2">
          <Button 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            variant="outline"
          >
            Anterior
          </Button>
          <span className="self-center">{`Pagina ${currentPage} din ${totalPages}`}</span>
          <Button 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Următor
          </Button>
        </div>
      )}
    </div>
  );
}