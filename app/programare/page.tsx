// app/programare/page.tsx
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import AppointmentForm from "./appointment-form";
import { LoginLink } from "@kinde-oss/kinde-auth-nextjs/server";
import { auth } from "@/auth";
import { CancelAppointmentDialog } from "./cancel-appointment-dialog";
import { ClientAppointmentStatusUpdate } from "./client-appointment-status-update";
import { format } from "date-fns";
import {
  Card,
  CardDescription,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableFooter,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Programează o ședință - Vagabond Barbershop",
  description:
    "Programează următoarea ta ședință de îngrijire la Vagabond Barbershop.",
};

async function getUserAppointments(userId: string) {
  return await prisma.appointment.findMany({
    where: {
      userId: userId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    orderBy: {
      date: "asc",
    },
    include: {
      barber: {
        include: {
          user: true,
        },
      },
      services: {
        include: {
          service: true,
        },
      },
    },
  });
}

async function getBarbers() {
  const barbers = await prisma.barber.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });

  return barbers.map((barber) => ({
    id: barber.id,
    userId: barber.userId,
    name: barber.user.name,
    image: barber.user.image,
    specialties: barber.specialties,
  }));
}

async function getServices() {
  return await prisma.service.findMany();
}

export default async function AppointmentPage() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-playfair text-primary mb-8 text-center">
          Programează o ședință
        </h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg text-center">
              Pentru a programa o ședință, vă rugăm să vă autentificați.
            </p>
            <div className="mt-6">
              <LoginLink className="btn btn-primary w-full">
                Autentifică-te
              </LoginLink>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isUser =
    session.user.roles.includes("user") &&
    session.user.permissions.includes("create_appointment");

  if (!isUser) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl sm:text-4xl font-playfair text-primary mb-8 text-center">
          Programează o ședință
        </h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-lg text-center">
              Pentru a programa o ședință, trebuie să fii autentificat ca
              utilizator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const appointments = await getUserAppointments(session.user.id);
  const barbers = await getBarbers();
  const services = await getServices();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-playfair text-primary mb-8 text-center">
        Programează o ședință
      </h1>
      {appointments.length > 0 ? (
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle>
                  Programare: {format(appointment.date, "dd MMMM yyyy, HH:mm")}
                </CardTitle>
                <CardDescription>
                  Frizer: {appointment.barber.user.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Detalii servicii
                    </h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Serviciu</TableHead>
                          <TableHead>Durată</TableHead>
                          <TableHead className="text-right">Preț</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointment.services.map((s) => (
                          <TableRow key={s.service.id}>
                            <TableCell>{s.service.name}</TableCell>
                            <TableCell>{s.service.duration} min</TableCell>
                            <TableCell className="text-right">
                              {s.service.price.toFixed(2)} RON
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                      <TableFooter>
                        <TableRow>
                          <TableCell colSpan={2}>Total</TableCell>
                          <TableCell className="text-right">
                            {appointment.services
                              .reduce((total, s) => total + s.service.price, 0)
                              .toFixed(2)}{" "}
                            RON
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      Rezumat programare
                    </h3>
                    <p>
                      <strong>Durată totală:</strong>{" "}
                      {appointment.services.reduce(
                        (total, s) => total + s.service.duration,
                        0
                      )}{" "}
                      minute
                    </p>
                    <p className="mb-4">
                      <strong>Preț total:</strong>{" "}
                      {appointment.services
                        .reduce((total, s) => total + s.service.price, 0)
                        .toFixed(2)}{" "}
                      RON
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">Status:</span>
                        <ClientAppointmentStatusUpdate
                          appointmentId={appointment.id}
                          currentStatus={appointment.status}
                        />
                      </div>
                      <div className="flex justify-end">
                        <CancelAppointmentDialog
                          appointmentId={appointment.id}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Fă o nouă programare</CardTitle>
          </CardHeader>
          <CardContent>
            {barbers.length >= 0 && (
              <AppointmentForm barbers={barbers} services={services} />
            )}
            {barbers.length === 0 && (
              <p className="text-lg text-center">
                Momentan nu sunt disponibili frizeri pentru programări.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
