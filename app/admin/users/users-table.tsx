'use client';

import { DataTable } from './data-table';
import { columns } from './columns';
import { User } from '@prisma/client';

type UserTableProps = {
  users: User[];
}

export default function UsersTable({ users }: UserTableProps) {
  return <DataTable columns={columns as any} data={users} />;
}