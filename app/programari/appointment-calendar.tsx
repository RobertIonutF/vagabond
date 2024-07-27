// app/programari/appointment-calendar.tsx
'use client';

import { useState } from 'react';
import { Calendar } from "@/components/ui/calendar";
import { AppointmentList } from './appointment-list';
import { fetchAppointmentsForDate } from './actions/fetch-appointments';

type Appointment = {
  id: string;
  date: Date;
  user: {
    name: string;
    email: string;
    phoneNumber: string | null;
  };
};

type AppointmentCalendarProps = {
  initialAppointments: Appointment[];
  barberId: string;
};

export default function AppointmentCalendar({ initialAppointments, barberId }: AppointmentCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const handleDateSelect = async (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      try {
        const fetchedAppointments = await fetchAppointmentsForDate(barberId, date);
        setAppointments(fetchedAppointments as Appointment[]);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // You might want to show an error message to the user here
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="rounded-md border"
        />
      </div>
      <div>
        <AppointmentList appointments={appointments as any} />
      </div>
    </div>
  );
}