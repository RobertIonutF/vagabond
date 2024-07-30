// app/admin/statistics/page.tsx
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueChart } from './revenue-chart';
import { AppointmentsChart } from './appointments-chart';
import { startOfYear, endOfYear, eachMonthOfInterval, format } from 'date-fns';

export const metadata: Metadata = {
  title: 'Statistici - Vagabond Barbershop',
  description: 'Vizualizează statisticile Vagabond Barbershop',
};

async function getStatistics() {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const monthlyAppointments = await prisma.appointment.count({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 
      {
          in: ['CONFIRMED','PAID', 'COMPLETED']
      }
    },
  });

  const monthlyAppointmentsWithServices = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      status: 
      {
        in: ['CONFIRMED', 'PAID', 'COMPLETED']
      }
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

  const totalUsers = await prisma.user.count();
  const totalBarbers = await prisma.barber.count();

  // Fetch data for charts
  const yearStart = startOfYear(currentDate);
  const yearEnd = endOfYear(currentDate);
  const monthsInYear = eachMonthOfInterval({ start: yearStart, end: yearEnd });

  const revenueData = await Promise.all(
    monthsInYear.map(async (month) => {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const appointmentsWithServices = await prisma.appointment.findMany({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          status: 
          {
            in: ['PAID', 'COMPLETED']
          }
        },
        include: {
          services: {
            include: {
              service: true,
            },
          },
        },
      });

      const revenue = appointmentsWithServices.reduce((total, appointment) => {
        return total + appointment.services.reduce((appointmentTotal, appointmentService) => {
          return appointmentTotal + appointmentService.service.price;
        }, 0);
      }, 0);

      return {
        month: format(month, 'MMM'),
        revenue: revenue,
      };
    })
  );

  console.log(revenueData);

  const appointmentsData = await Promise.all(
    monthsInYear.map(async (month) => {
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      
      const appointmentsCount = await prisma.appointment.count({
        where: {
          date: {
            gte: startOfMonth,
            lte: endOfMonth,
          },
          status:
          {
              in: ['CONFIRMED' ,'PAID', 'COMPLETED']
          }
        },
      });

      return {
        month: format(month, 'MMM'),
        appointments: appointmentsCount,
      };
    })
  );

  return {
    monthlyAppointments,
    monthlyRevenue,
    totalUsers,
    totalBarbers,
    revenueData,
    appointmentsData,
  };
}

export default async function AdminStatistics() {
  const stats = await getStatistics();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Statistici</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Programări Lunare
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Venit Lunar
            </CardTitle>
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
              Total Utilizatori
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Frizeri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBarbers}</div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Venit Lunar</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={stats.revenueData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Programări Lunare</CardTitle>
          </CardHeader>
          <CardContent>
            <AppointmentsChart data={stats.appointmentsData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}