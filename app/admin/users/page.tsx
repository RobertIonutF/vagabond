import { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import UsersTable from "./users-table";
import { cache } from "react";
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export const metadata: Metadata = {
  title: "Gestionare Utilizatori - Vagabond Barbershop",
  description: "Administrează utilizatorii Vagabond Barbershop",
};

const getUsers = cache(async () => {
  try {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        roles: true,
        isSuspended: true,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
});

export default async function AdminUsers() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare Utilizatori</h1>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <UsersTable users={users as User[]} />
      </Suspense>
    </div>
  );
}
