// app/profile/actions/update-specialties.ts
'use server';

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBarberSpecialties(userId: string, specialties: string[]) {
  const session = await auth();

  if (!session || !session.user || session.user.id !== userId) {
    throw new Error("Nu ai permisiunea de a actualiza specialitățile.");
  }

  try {
    const barber = await prisma.barber.findUnique({
      where: { userId: userId },
    });

    if (!barber) {
      throw new Error("Profilul de frizer nu a fost găsit.");
    }

    await prisma.barber.update({
      where: { id: barber.id },
      data: {
        specialties: specialties,
      },
    });

    revalidatePath('/profile/settings');
    return { success: true };
  } catch (error) {
    console.error('Error updating barber specialties:', error);
    throw new Error("A apărut o eroare la actualizarea specialităților. Vă rugăm să încercați din nou.");
  }
}