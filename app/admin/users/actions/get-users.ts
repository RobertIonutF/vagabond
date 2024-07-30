'use server';

import prisma from '@/lib/prisma';
import { User, Prisma } from '@prisma/client';

export type UserWithRoles = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    roles: true;
    isSuspended: true;
  };
}>;

export async function getUsers(): Promise<UserWithRoles[]> {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      roles: true,
      isSuspended: true,
    },
    orderBy: {
      name: 'asc',
    },
  });
}