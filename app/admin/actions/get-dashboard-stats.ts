'use server';

import prisma from '@/lib/prisma';

interface DashboardStats {
  totalUsers: number;
  activeServices: number;
  monthlyRevenue: number;
  monthlyAppointments: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  const [totalUsers, activeServices, monthlyAppointments, monthlyAppointmentsWithServices] = await Promise.all([
    prisma.user.count(),
    prisma.service.count({ where: { isActive: true } }),
    prisma.appointment.count({
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
    }),
    prisma.appointment.findMany({
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
    }),
  ]);

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