// app/programare/actions/fetch-available-dates.ts
'use server'

import { startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns'
import prisma from "@/lib/prisma"

export async function fetchAvailableDates(barberId: string, month: Date) {
  const monthStart = startOfMonth(month)
  const monthEnd = endOfMonth(month)

  // Fetch all appointments for the selected barber in the given month
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId: barberId,
      date: {
        gte: monthStart,
        lte: monthEnd,
      },
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    },
    select: {
      date: true,
    }
  })

  // Generate all days in the month
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Count appointments for each day
  const appointmentCounts = allDays.map(day => ({
    date: day,
    count: appointments.filter(app => isSameDay(app.date, day)).length
  }))

  // Assume 8 available slots per day (9 AM to 5 PM, one hour each)
  const availableDates = appointmentCounts
    .filter(day => day.count < 8)
    .map(day => day.date)

  return availableDates
}