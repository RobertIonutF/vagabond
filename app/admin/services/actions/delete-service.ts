"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteService(id: string) {
    const session = await auth()
  
    if (!session || !session.user || !session.user.roles.includes('admin')) {
      throw new Error("Nu aveți permisiunea de a șterge servicii.")
    }
  
    try {
      await prisma.service.delete({
        where: { id },
      })
  
      revalidatePath("/admin/services")
      revalidatePath("/")
      revalidatePath("/programare")
    } catch (error) {
      console.error("Error deleting service:", error)
      throw new Error("A apărut o eroare la ștergerea serviciului.")
    }
  }