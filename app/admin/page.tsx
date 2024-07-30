import { Suspense } from 'react';
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Scissors, DollarSign } from 'lucide-react';
import { getDashboardStats } from './actions/get-dashboard-stats';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Vagabond Barbershop',
  description: 'Panoul de administrare pentru Vagabond Barbershop',
};

export default async function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

async function DashboardContent() {
  const stats = await getDashboardStats();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Utilizatori"
        value={stats.totalUsers}
        icon={<Users className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Servicii Active"
        value={stats.activeServices}
        icon={<Scissors className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Venit Lunar"
        value={new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(stats.monthlyRevenue)}
        icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
      />
      <StatCard
        title="Programări Lunare"
        value={stats.monthlyAppointments}
        icon={<BarChart className="h-4 w-4 text-muted-foreground" />}
      />
    </div>
  );
}

function StatCard({ title, value, icon } : { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}