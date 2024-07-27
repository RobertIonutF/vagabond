// app/admin/users/actions/change-role.ts
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { sendSMS } from "@/lib/sms";
import { revalidatePath } from "next/cache";

export async function changeUserRole(
  userId: string,
  newRole: "user" | "barber"
) {
  const session = await auth();

  if (!session || !session.user || !session.user.roles.includes("admin")) {
    throw new Error(
      "Nu aveți permisiunea de a schimba rolurile utilizatorilor."
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { barberProfile: true },
    });

    if (!user) {
      throw new Error("Utilizatorul nu a fost găsit.");
    }

    if (user.roles.includes("admin")) {
      throw new Error("Nu puteți modifica rolul unui administrator.");
    }

    if (newRole === "barber" && !user.roles.includes("barber")) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          roles: { push: "barber" },
          permissions: { push: ["update_appointments", "view_appointments"] },
          barberProfile: {
            create: {
              specialties: [],
            },
          },
        },
      });

      const message = `Felicitări! Ați fost promovat la rolul de frizer. Vă rugăm să vă conectați la contul dumneavoastră pentru a completa profilul.`;
      if (user.phoneNumber) {
        await sendSMS(user.phoneNumber, message);
      }
    } else if (newRole === "user" && user.roles.includes("barber")) {
      // Fetch all appointments for this barber
      const appointments = await prisma.appointment.findMany({
        where: { barberId: user.barberProfile?.id },
        include: { user: true },
      });

      // Demote to user
      await prisma.user.update({
        where: { id: userId },
        data: {
          roles: user.roles.filter((role) => role !== "barber"),
          permissions: {
            set: ["create_appointment"],
          },
          barberProfile: {
            delete: true,
          },
        },
      });

      // Send SMS to the demoted barber
      if (user.phoneNumber) {
        const barberMessage =
          "Rolul dumneavoastră a fost schimbat la client. Toate programările dumneavoastră au fost anulate.";
        await sendSMS(user.phoneNumber, barberMessage);
      }

      // Send SMS to all clients with cancelled appointments
      for (const appointment of appointments) {
        if (appointment.user.phoneNumber) {
          const clientMessage = `Programarea dumneavoastră din data de ${appointment.date.toLocaleDateString(
            "ro-RO"
          )} la ora ${appointment.date.toLocaleTimeString(
            "ro-RO"
          )} a fost anulată deoarece frizerul nu mai este disponibil.`;
          await sendSMS(appointment.user.phoneNumber, clientMessage);
        }
      }

      // Delete all appointments
      await prisma.appointment.deleteMany({
        where: { barberId: user.barberProfile?.id },
      });
    }

    revalidatePath("/admin/users");
  } catch (error) {
    console.error("Error changing user role:", error);
    throw new Error("A apărut o eroare la schimbarea rolului utilizatorului.");
  }
}
