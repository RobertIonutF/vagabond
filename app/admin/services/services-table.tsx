import { DataTable } from './data-table';
import { columns } from './columns';
import { Service } from '@prisma/client';

type ServiceTableProps = {
  services: Service[];
}

export default function ServicesTable({ services }: ServiceTableProps) {
  return <DataTable columns={columns} data={services} />;
}