// app/admin/page.tsx
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Users, Scissors, DollarSign } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Vagabond Barbershop',
  description: 'Panoul de administrare pentru Vagabond Barbershop',
};

async function getDashboardStats() {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const totalUsers = await prisma.user.count();

  const activeServices = await prisma.service.count({
    where: { isActive: true }, 
  });

  const monthlyAppointments = await prisma.appointment.count({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'CONFIRMED',
    },
  });

  const monthlyAppointmentsWithServices = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 'PAID',
    },
    include: {
      services: {
        include: {
          service: true,
        },
      },
    },
  });

  const monthlyRevenue = monthlyAppointmentsWithServices.reduce((total, appointment) => {
    return total + appointment.services.reduce((appointmentTotal, appointmentService) => {
      return appointmentTotal + appointmentService.service.price;
    }, 0);
  }, 0);

  return {
    totalUsers,
    activeServices,
    monthlyRevenue,
    monthlyAppointments,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Utilizatori
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Servicii Active
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeServices}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Venit Lunar
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('ro-RO', { style: 'currency', currency: 'RON' }).format(stats.monthlyRevenue)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Programări Lunare
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyAppointments}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}