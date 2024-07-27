// app/page.tsx
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import HomePageClient from './home-client';

export const metadata: Metadata = {
  title: 'Vagabond Barbershop - Acasă',
  description: 'Experimentați arta bărbieritului la Vagabond Barbershop - unde stilul clasic întâlnește îngrijirea modernă.',
};

async function getServices() {
  return await prisma.service.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });
}

async function getLatestTestimonials() {
  return await prisma.testimonial.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true },
      },
    },
  });
}

export default async function HomePage() {
  const services = await getServices();
  const testimonials = await getLatestTestimonials();

  return <HomePageClient services={services as any} testimonials={testimonials as any} />;
}