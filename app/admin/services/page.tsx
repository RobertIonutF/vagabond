// app/admin/services/page.tsx
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { DataTable } from './data-table';
import { columns } from './columns';
import { AddServiceDialog } from './add-service-dialog';

export const metadata: Metadata = {
  title: 'Gestionare Servicii - Vagabond Barbershop',
  description: 'Administrează serviciile oferite de Vagabond Barbershop',
};

async function getServices() {
  return await prisma.service.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export default async function AdminServices() {
  const services = await getServices();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionare Servicii</h1>
        <AddServiceDialog />
      </div>
      <DataTable columns={columns} data={services} />
    </div>
  );
}