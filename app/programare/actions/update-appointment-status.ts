// app/programare/actions/update-appointment-status.ts
'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { sendSMS } from "@/lib/sms"
import { revalidatePath } from "next/cache"

export async function updateAppointmentStatus(appointmentId: string, newStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'PAID') {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Nu sunteți autentificat.")
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        user: true,
        barber: {
          include: {
            user: true
          }
        }
      }
    })

    if (!appointment) {
      throw new Error("Programarea nu a fost găsită.")
    }

    // Check permissions based on user role
    const isBarber = session.user.roles.includes('barber') && session.user.permissions.includes('update_appointment')
    const isClient = session.user.id === appointment.userId

    if (!isBarber && !isClient) {
      throw new Error("Nu aveți permisiunea de a actualiza statusul programării.")
    }

    // Enforce client restrictions
    if (isClient && (newStatus !== 'CONFIRMED' || appointment.status !== 'PENDING')) {
      throw new Error("Clientul poate doar să confirme o programare în așteptare.")
    }

    if(appointment.status === "CONFIRMED" && newStatus === "CANCELLED") { 
      throw new Error("Nu puteți anula o programare confirmată.")
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: newStatus },
    })

    // Send SMS notifications
    if (appointment.user.phoneNumber) {
      let clientMessage = `Statusul programării dvs. la Vagabond Barbershop pentru ${appointment.date.toLocaleDateString()} la ora ${appointment.date.toLocaleTimeString()} a fost actualizat la ${newStatus}.`
      if (isClient) {
        clientMessage = `Ați confirmat programarea la Vagabond Barbershop pentru ${appointment.date.toLocaleDateString()} la ora ${appointment.date.toLocaleTimeString()}.`
      }
      await sendSMS(appointment.user.phoneNumber, clientMessage)
    }

    if (appointment.barber.user.phoneNumber) {
      let barberMessage = `O programare pentru ${appointment.date.toLocaleDateString()} la ora ${appointment.date.toLocaleTimeString()} a fost actualizată la statusul ${newStatus}.`
      if (isClient) {
        barberMessage = `Clientul a confirmat programarea pentru ${appointment.date.toLocaleDateString()} la ora ${appointment.date.toLocaleTimeString()}.`
      }
      await sendSMS(appointment.barber.user.phoneNumber, barberMessage)
    }

    revalidatePath('/programare')

    return updatedAppointment
  } catch (error) {
    console.error('Error updating appointment status:', error)
    throw new Error("A apărut o eroare la actualizarea statusului programării. Vă rugăm să încercați din nou.")
  }
}