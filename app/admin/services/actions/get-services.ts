'use server';

import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export type ServiceWithDetails = Prisma.ServiceGetPayload<{
  select: {
    id: true;
    name: true;
    price: true;
    duration: true;
    isActive: true;
  };
}>;

export async function getServices(): Promise<ServiceWithDetails[]> {
  return await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      duration: true,
      isActive: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}