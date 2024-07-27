/* app/programare/actions/cancel-appointment.ts */
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendSMS } from "@/lib/sms";
import { revalidatePath } from "next/cache";

export async function cancelAppointment(appointmentId: string) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Trebuie să fii autentificat pentru a anula o programare.");
  }

  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { user: true },
    });

    if (!appointment) {
      throw new Error("Programarea nu a fost găsită.");
    }

    if (appointment.userId !== session.user.id) {
      throw new Error("Nu ai permisiunea de a anula această programare.");
    }

    const updatedAppointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "CANCELLED" },
    });

    // Send SMS notification
    if (appointment.user.phoneNumber) {
      const smsBody = `Programarea ta la Vagabond Barbershop pentru ${appointment.date.toLocaleDateString()} la ora ${appointment.date.toLocaleTimeString()} a fost anulată.`;
      await sendSMS(appointment.user.phoneNumber, smsBody);
    }

    const barber = await prisma.barber.findUnique({
      where: { id: appointment.barberId },
      include: { user: true },
    });

    if (barber?.user.phoneNumber) {
      const smsBody = `Programarea cu ${appointment.user.name} pentru ${appointment.date.toLocaleDateString()} la ora ${appointment.date.toLocaleTimeString()} a fost anulată.`;
      await sendSMS(barber.user.phoneNumber, smsBody);
    }

    revalidatePath("/programare");
    return { success: true, appointment: updatedAppointment };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw new Error(
      "A apărut o eroare la anularea programării. Vă rugăm să încercați din nou."
    );
  }
}
