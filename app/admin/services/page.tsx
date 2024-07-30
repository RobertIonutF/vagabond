import { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import ServicesTable from './services-table';
import { AddServiceDialog } from './add-service-dialog';

export const metadata: Metadata = {
  title: 'Gestionare Servicii - Vagabond Barbershop',
  description: 'Administrează serviciile oferite de Vagabond Barbershop',
};

export default function AdminServices() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionare Servicii</h1>
        <AddServiceDialog />
      </div>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <ServicesTable />
      </Suspense>
    </div>
  );
}