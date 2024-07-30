// app/programari/[id]/page.tsx
import { Metadata } from "next";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AppointmentStatusUpdate } from "./appointment-status-update";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Detalii Programare - Vagabond Barbershop",
  description: "Vizualizează și actualizează detaliile programării la Vagabond Barbershop.",
};

async function getAppointment(id: string) {
  return await prisma.appointment.findUnique({
    where: { id },
    include: {
      services: {
        include: {
          service: true,
        }
      },
      user: {
        select: {
          name: true,
          email: true,
          phoneNumber: true,
        },
      },
      barber: {
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
}

export default async function AppointmentDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session || !session.user || !session.user.roles.includes('barber') || !session.user.permissions.includes('view_appointments')) {
    redirect('/');
  }

  const appointment = await getAppointment(params.id);

  if (!appointment) {
    notFound();
  }

  const totalDuration = appointment.services.reduce((sum, s) => sum + s.service.duration, 0);
  const totalPrice = appointment.services.reduce((sum, s) => sum + s.service.price, 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair text-primary mb-8">Detalii Programare</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informații Client</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Nume:</strong> {appointment.user.name}</p>
            <p className="mb-2"><strong>Email:</strong> {appointment.user.email}</p>
            <p className="mb-2"><strong>Telefon:</strong> {appointment.user.phoneNumber || 'N/A'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Detalii Programare</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2"><strong>Data:</strong> {format(appointment.date, 'dd MMMM yyyy')}</p>
            <p className="mb-2"><strong>Ora:</strong> {format(appointment.date, 'HH:mm')}</p>
            <p className="mb-2"><strong>Frizer:</strong> {appointment.barber.user.name}</p>
            <div className="mb-2">
              <strong>Status:</strong> 
              <AppointmentStatusUpdate appointmentId={appointment.id} currentStatus={appointment.status as any} />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Servicii</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Lista serviciilor programate</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Serviciu</TableHead>
                <TableHead>Durată</TableHead>
                <TableHead className="text-right">Preț</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointment.services.map(s => (
                <TableRow key={s.id}>
                  <TableCell>{s.service.name}</TableCell>
                  <TableCell>{s.service.duration} minute</TableCell>
                  <TableCell className="text-right">{s.service.price.toFixed(2)} RON</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">{totalPrice.toFixed(2)} RON</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-between items-center">
            <Badge variant="secondary">Durată totală: {totalDuration} minute</Badge>
            <Badge variant="default">Preț total: {totalPrice.toFixed(2)} RON</Badge>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <Link href="/programari">
          <Button>Înapoi la lista de programări</Button>
        </Link>
      </div>
    </div>
  );
}