"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function suspendUser(userId: string, suspend: boolean) {
    const session = await auth()
  
    if (!session || !session.user || !session.user.roles.includes('admin')) {
      throw new Error("Nu aveți permisiunea de a suspenda utilizatori.")
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
  
      if (!user) {
        throw new Error("Utilizatorul nu a fost găsit.")
      }
  
      if (user.roles.includes('admin')) {
        throw new Error("Nu puteți suspenda un administrator.")
      }
  
      await prisma.user.update({
        where: { id: userId },
        data: { isSuspended: suspend },
      })
  
      revalidatePath("/admin/users")
    } catch (error) {
      console.error("Error suspending user:", error)
      throw new Error("A apărut o eroare la suspendarea/reactivarea utilizatorului.")
    }
  }