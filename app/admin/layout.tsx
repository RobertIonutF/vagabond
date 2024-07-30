import { ReactNode, Suspense } from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import AdminSidebar with no SSR
const AdminSidebar = dynamic(() => import('@/components/sidebar/admin-sidebar'), {
  ssr: false,
  loading: () => <div className="w-64 bg-gray-100 dark:bg-gray-800">Loading...</div>
});

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || !session.user || !session.user.roles.includes('admin')) {
    redirect('/');
  }

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