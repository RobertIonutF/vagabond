// app/page.tsx
import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import HomePageClient from './home-client';

export const metadata: Metadata = {
  title: 'Vagabond Barbershop - Acasă',
  description: 'Experimentați arta bărbieritului la Vagabond Barbershop - unde stilul clasic întâlnește îngrijirea modernă.',
};

export default async function HomePage() {
  async function getServices() {
    try {
      return await prisma.service.findMany({
        where: { isActive: true },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      console.error('Error fetching services:', error);
      return [];
    }
  }
  
  async function getLatestTestimonials() {
    try {
      return await prisma.testimonial.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { name: true },
          },
        },
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return [];
    }
  }

  const services = await getServices();
  const testimonials = await getLatestTestimonials();

  return <HomePageClient services={services as any} testimonials={testimonials as any} />;
}