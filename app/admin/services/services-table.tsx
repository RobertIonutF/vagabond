'use client';

import { useEffect, useState } from 'react';
import { DataTable } from './data-table';
import { columns } from './columns';
import { getServices, ServiceWithDetails } from './actions/get-services';

export default function ServicesTable() {
  const [services, setServices] = useState<ServiceWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error('Failed to fetch services:', error);
        // Handle error (e.g., show error message)
      } finally {
        setIsLoading(false);
      }
    }

    fetchServices();
  }, []);

  if (isLoading) {
    return <div>Loading services...</div>;
  }

  return <DataTable columns={columns} data={services} />;
}