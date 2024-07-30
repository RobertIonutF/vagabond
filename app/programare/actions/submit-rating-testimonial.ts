// app/programare/actions/submit-rating-testimonial.ts
"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitRatingAndTestimonial(
  appointmentId: string,
  rating: number,
  testimonial: string
) {
  const session = await auth();

  if (!session || !session.user) {
    throw new Error("Trebuie să fiți autentificat pentru a lăsa un feedback.");
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
      throw new Error("Nu aveți permisiunea de a lăsa feedback pentru această programare.");
    }

    if (appointment.status !== "PAID") {
      throw new Error("Puteți lăsa feedback doar pentru programările plătite.");
    }

    await prisma.testimonial.create({
      data: {
        rating,
        content: testimonial,
        userId: session.user.id,
        appointmentId,
      },
    });

    await prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "COMPLETED" },
    });

    revalidatePath("/");
    revalidatePath("/programare");
  } catch (error) {
    console.error("Error submitting rating and testimonial:", error);
    throw new Error("A apărut o eroare la trimiterea feedback-ului. Vă rugăm să încercați din nou.");
  }
}