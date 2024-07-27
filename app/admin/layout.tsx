// app/admin/layout.tsx
import { ReactNode } from 'react';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from '@/components/sidebar/admin-sidebar';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  if (!session || !session.user || !session.user.roles.includes('admin')) {
    redirect('/');
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}