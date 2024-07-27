// app/profile/settings/page.tsx
import { Metadata } from 'next';
import { auth } from "@/auth";
import prisma from '@/lib/prisma';
import SettingsForm from './settings-form';

export const metadata: Metadata = {
  title: 'Setări Profil - Vagabond Barbershop',
  description: 'Gestionează-ți setările profilului la Vagabond Barbershop.',
};

async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      barberProfile: true,
    },
  });

  return {
    name: user?.name,
    email: user?.email,
    phoneNumber: user?.phoneNumber,
    isBarber: user?.roles.includes('barber'),
    barberSpecialties: user?.barberProfile?.specialties || [],
  };
}

export default async function ProfileSettings() {
  const session = await auth();

  if (!session || !session.user) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-playfair text-leather-brown mb-8">Setări Profil</h1>
        <p className="text-center">Trebuie să fii autentificat pentru a accesa această pagină.</p>
      </div>
    );
  }

  const userProfile = await getUserProfile(session.user.id);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-playfair text-leather-brown mb-8">Setări Profil</h1>
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <SettingsForm 
          initialData={userProfile as any}
          userId={session.user.id}
          isBarber={userProfile.isBarber || false}
          barberSpecialties={userProfile.barberSpecialties}
        />
      </div>
    </div>
  );
}