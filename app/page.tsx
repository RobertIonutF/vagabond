import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import HomePageClient from './home-client';
import { cache } from 'react';

export const metadata: Metadata = {
  title: 'Vagabond Barbershop - Acasă',
  description: 'Experimentați arta bărbieritului la Vagabond Barbershop - unde stilul clasic întâlnește îngrijirea modernă.',
  openGraph: {
    title: 'Vagabond Barbershop - Acasă',
    description: 'Experimentați arta bărbieritului la Vagabond Barbershop - unde stilul clasic întâlnește îngrijirea modernă.',
    type: 'website',
    url: 'https://vagabondbarbershop.ro',
    images: [
      {
        url: 'https://vagabondbarbershop.ro/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vagabond Barbershop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vagabond Barbershop - Acasă',
    description: 'Experimentați arta bărbieritului la Vagabond Barbershop - unde stilul clasic întâlnește îngrijirea modernă.',
    images: ['https://vagabondbarbershop.ro/twitter-image.jpg'],
  },
};

const getServices = cache(async () => {
  try {
    return await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
});

const getLatestTestimonials = cache(async () => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    const uniqueTestimonials = [];
    const userIds = new Set();

    for (const testimonial of testimonials) {
      if (!userIds.has(testimonial.userId)) {
        uniqueTestimonials.push(testimonial);
        userIds.add(testimonial.userId);
      }
      if (uniqueTestimonials.length >= 3) break;
    }

    return uniqueTestimonials;
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
});

export default async function HomePage() {
  const [services, testimonials] = await Promise.all([
    getServices(),
    getLatestTestimonials(),
  ]);

  return (
    <HomePageClient services={services as any} testimonials={testimonials as any} />
  );
}