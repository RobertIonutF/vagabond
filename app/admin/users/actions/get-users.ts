'use server';

import prisma from '@/lib/prisma';
import { User, Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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
  revalidatePath('/admin/users');

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