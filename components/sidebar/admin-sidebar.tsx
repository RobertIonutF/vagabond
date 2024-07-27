// app/admin/components/admin-sidebar.tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Scissors, Users, BarChart } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/services', label: 'Servicii', icon: Scissors },
  { href: '/admin/users', label: 'Utilizatori', icon: Users },
  { href: '/admin/statistics', label: 'Statistici', icon: BarChart },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-white dark:bg-gray-800 w-64 min-h-screen p-4">
      <nav className="mt-8">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href} className="mb-2">
                <Link href={item.href}>
                  <span className={`flex items-center p-2 rounded-lg ${
                    pathname === item.href
                      ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}>
                    <Icon className="w-6 h-6 mr-3" />
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}