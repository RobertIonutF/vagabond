import { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import ServicesTable from './services-table';
import { AddServiceDialog } from './add-service-dialog';
import { cache } from 'react';
import prisma from '@/lib/prisma';
import { Service } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Gestionare Servicii - Vagabond Barbershop',
  description: 'Administrează serviciile oferite de Vagabond Barbershop',
};

const getServices = cache(async () => { 
  try {
    return await prisma.service.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        duration: true,
      },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
});

export default async function AdminServices() {
  const services = await getServices();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionare Servicii</h1>
        <AddServiceDialog />
      </div>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <ServicesTable services={services as Service[]} />
      </Suspense>
    </div>
  );
}