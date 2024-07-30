import { Suspense } from 'react';
import { Metadata } from 'next';
import { Loader2 } from 'lucide-react';
import UsersTable from './users-table';

export const metadata: Metadata = {
  title: 'Gestionare Utilizatori - Vagabond Barbershop',
  description: 'Administrează utilizatorii Vagabond Barbershop',
};

export default async function AdminUsers() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestionare Utilizatori</h1>
      <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
        <UsersTable />
      </Suspense>
    </div>
  );
}