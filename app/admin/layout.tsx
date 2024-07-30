import { ReactNode, Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import AdminSidebar from '@/components/sidebar/admin-sidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Suspense fallback={<div className="w-64 bg-gray-100 dark:bg-gray-800">Loading...</div>}>
        <AdminSidebar />
      </Suspense>
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin" />}>
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </Suspense>
      </main>
    </div>
  );
}