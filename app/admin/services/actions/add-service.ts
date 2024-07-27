"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addService(data: {
  name: string;
  price: number;
  duration: number;
}) {
  const session = await auth();

  if (!session || !session.user || !session.user.roles.includes("admin")) {
    throw new Error("Nu aveți permisiunea de a adăuga servicii.");
  }

  try {
    await prisma.service.create({
      data: {
        name: data.name,
        price: data.price,
        duration: data.duration,
        isActive: true,
      },
    });

    revalidatePath("/admin/services");
    revalidatePath("/programare")
    revalidatePath("/")
  } catch (error) {
    console.error("Error adding service:", error);
    throw new Error("A apărut o eroare la adăugarea serviciului.");
  }
}
