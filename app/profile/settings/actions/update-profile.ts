'use server';

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

type ProfileData = {
  name: string;
  email: string;
  phoneNumber: string;
};

export async function updateUserProfile(userId: string, data: ProfileData) {
  const session = await auth();

  if (!session || !session.user || session.user.id !== userId) {
    throw new Error("Nu ai permisiunea de a actualiza acest profil.");
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
    });

    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw new Error("A apărut o eroare la actualizarea profilului. Vă rugăm să încercați din nou.");
  }
}