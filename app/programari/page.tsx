// app/programari/page.tsx
import { Metadata } from "next";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AppointmentCalendar from "./appointment-calendar";

export const metadata: Metadata = {
  title: "Programări - Vagabond Barbershop",
  description: "Vizualizează și gestionează programările tale ca frizer la Vagabond Barbershop.",
};

async function getBarberAppointments(barberId: string) {
  const currentDate = new Date();
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));

  return await prisma.appointment.findMany({
    where: {
      barberId: barberId,
      date: {
        gte: startOfDay,
      },
    },
    orderBy: {
      date: 'asc',
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
    },
  });
}

export default async function ProgramariPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.roles.includes('barber') || !session.user.permissions.includes('view_appointments')) {
    redirect('/');
  }

  const barber = await prisma.barber.findUnique({
    where: { userId: session.user.id },
  });

  if (!barber) {
    throw new Error("Barber profile not found");
  }

  const appointments = await getBarberAppointments(barber.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair text-primary mb-8">Programările mele</h1>
      <AppointmentCalendar initialAppointments={appointments as any} barberId={barber.id} />
    </div>
  );
}