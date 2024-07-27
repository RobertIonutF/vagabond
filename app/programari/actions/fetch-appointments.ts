// app/programari/actions/fetch-appointments.ts
'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { startOfDay, endOfDay } from 'date-fns'

export async function fetchAppointmentsForDate(barberId: string, date: Date) {
  const session = await auth()

  if (!session || !session.user || !session.user.roles.includes('barber') || !session.user.permissions.includes('view_appointments')) {
    throw new Error("Nu aveți permisiunea de a vizualiza programările.")
  }

  const dayStart = startOfDay(date)
  const dayEnd = endOfDay(date)

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        barberId: barberId,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          not: 'CANCELLED'
        }
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
    })

    return appointments
  } catch (error) {
    console.error('Error fetching appointments:', error)
    throw new Error("A apărut o eroare la încărcarea programărilor. Vă rugăm să încercați din nou.")
  }
}