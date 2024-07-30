'use client';

import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getUsers, UserWithRoles } from './actions/get-users';

export default function UsersTable() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const fetchedUsers = await getUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
        // Handle error (e.g., show error message)
      } finally {
        setIsLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading users...</div>;
  }

  return <DataTable columns={columns as any} data={users} />;
}