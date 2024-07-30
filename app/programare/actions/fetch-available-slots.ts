// app/programare/actions/fetch-available-slots.ts
'use server'

import { startOfDay, endOfDay, eachHourOfInterval, format, isEqual, addMinutes } from 'date-fns'
import prisma from "@/lib/prisma"
import { revalidatePath } from 'next/cache'

export async function fetchAvailableSlots(barberId: string, selectedDate: Date) {
  const dayStart = startOfDay(selectedDate)
  const dayEnd = endOfDay(selectedDate)

  // Fetch all appointments for the selected barber on the selected date
  const appointments = await prisma.appointment.findMany({
    where: {
      barberId: barberId,
      date: {
        gte: dayStart,
        lte: dayEnd,
      },
      status: {
        in: ['PENDING', 'CONFIRMED']
      }
    },
    select: {
      date: true,
    }
  })

  // Generate all possible time slots for the day
  const allSlots = eachHourOfInterval({
    start: new Date(dayStart.setHours(9, 0, 0, 0)), // Assuming 9 AM start
    end: new Date(dayStart.setHours(17, 0, 0, 0)), // Assuming 5 PM end
  })

  // Filter out the booked slots
  const availableSlots = allSlots.filter(slot => 
    !appointments.some(app => 
      isEqual(app.date, slot) || 
      (app.date > slot && app.date < addMinutes(slot, 60)) // Check if appointment is within the hour
    )
  )

  revalidatePath('/programare')
  return availableSlots.map(slot => format(slot, 'HH:mm'))
}