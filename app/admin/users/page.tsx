// app/admin/users/page.tsx
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { DataTable } from './data-table';
import { columns } from './columns';

export const metadata: Metadata = {
  title: 'Gestionare Utilizatori - Vagabond Barbershop',
  description: 'Administrează utilizatorii Vagabond Barbershop',
};

async function getUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      isSuspended: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function AdminUsers() {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare Utilizatori</h1>
      <DataTable columns={columns as any} data={users} />
    </div>
  );
}