'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { sendSMS } from "@/lib/sms"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const appointmentSchema = z.object({
  barberId: z.string(),
  date: z.date(),
  time: z.string(),
  services: z.array(z.string()),
  extraInfo: z.string().optional(),
})

export async function createAppointment(data: z.infer<typeof appointmentSchema>) {
  const session = await auth()

  if (!session || !session.user) {
    throw new Error("Trebuie să fii autentificat pentru a crea o programare.")
  }

  if (!session.user.permissions.includes('create_appointment')) {
    throw new Error("Nu ai permisiunea de a crea o programare.")
  }

  const { barberId, date, time, services, extraInfo } = appointmentSchema.parse(data)

  const appointmentDateTime = new Date(date)
  const [hours, minutes] = time.split(':')
  appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0)

  try {
    const barber = await prisma.barber.findUnique({
      where: { userId: barberId },
      include: { user: true }
    })

    if (!barber) {
      throw new Error("Frizerul selectat nu există.")
    }

    if (barber.userId === session.user.id) {
      throw new Error("Nu poți face o programare la tine însuți.")
    }

    // Check for existing appointments at the same time
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        barberId: barber.id,
        date: appointmentDateTime,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (existingAppointment) {
      throw new Error("Această oră este deja rezervată. Vă rugăm să alegeți o altă oră.")
    }

    // Check if the user already has an active appointment
    const userExistingAppointment = await prisma.appointment.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (userExistingAppointment) {
      throw new Error("Ai deja o programare activă. Te rugăm să o anulezi înainte de a face o nouă programare.")
    }

    // Fetch selected services
    const selectedServices = await prisma.service.findMany({
      where: {
        id: { in: services }
      }
    })

    if (selectedServices.length !== services.length) {
      throw new Error("Unul sau mai multe servicii selectate nu există.")
    }

    const appointment = await prisma.appointment.create({
      data: {
        userId: session.user.id,
        barberId: barber.id,
        date: appointmentDateTime,
        status: "PENDING",
        extraInfo: extraInfo,
        services: {
          create: selectedServices.map(service => ({
            service: { connect: { id: service.id } }
          }))
        }
      },
      include: {
        user: true,
        barber: {
          include: {
            user: true
          }
        },
        services: {
          include: {
            service: true
          }
        }
      },
    })

    // Calculate total price and duration
    const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0)
    const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0)

    // Attempt to send SMS, but don't let it block appointment creation
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { phoneNumber: true },
      })

      if (user?.phoneNumber) {
        const smsBody = `Salut! Programarea ta la Vagabond Barbershop a fost trimisa pentru ${appointmentDateTime.toLocaleDateString()} la ora ${time} cu ${barber.user?.name}. Servicii: ${selectedServices.map(s => s.name).join(', ')}. Durată totală: ${totalDuration} minute. Preț total: ${totalPrice.toFixed(2)} RON. Te așteptăm!`
        await sendSMS(user.phoneNumber, smsBody)
      }

      if (barber.user?.phoneNumber) {
        const smsBody = `Salut! Ai o nouă programare la Vagabond Barbershop pentru ${appointmentDateTime.toLocaleDateString()} la ora ${time} cu ${session.user.name}. Servicii: ${selectedServices.map(s => s.name).join(', ')}. Durată totală: ${totalDuration} minute, Preț total: ${totalPrice.toFixed(2)} RON, Contactați clientul la ${user?.phoneNumber}. pentru a confirma programarea.`
        await sendSMS(barber.user.phoneNumber, smsBody)
      }
    } catch (smsError) {
      console.error('Failed to send SMS:', smsError)
    }

    revalidatePath('/programare')
    return { success: true, appointment }
  } catch (error) {
    console.error('Error creating appointment:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error("A apărut o eroare la crearea programării. Vă rugăm să încercați din nou.")
  }
}