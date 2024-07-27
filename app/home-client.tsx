// app/home-page-client.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import heroImage from "@/public/images/hero.png";
import { motion } from "framer-motion";
import { Service, Testimonial } from "@prisma/client";

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

interface HomePageClientProps {
  services: Service[];
  testimonials: (Testimonial & { user: { name: string } })[];
}

export default function HomePageClient({
  services,
  testimonials,
}: HomePageClientProps) {
  return (
    <div className="min-h-screen bg-background">
      <motion.section
        className="container mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <motion.div
          className="md:w-1/2 mb-8 md:mb-0"
          variants={fadeInUpVariants}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair text-primary mb-4">
            Stil clasic. Îngrijire modernă.
          </h1>
          <p className="text-foreground mb-6 text-lg">
            Experimentați arta bărbieritului la Vagabond Barbershop, unde
            tradiția se îmbină perfect cu tehnicile contemporane.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href="/programare"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
            >
              Rezervă o programare
            </Link>
          </motion.div>
        </motion.div>
        <motion.div className="md:w-1/2" variants={fadeInUpVariants}>
          <Image
            src={heroImage}
            alt="Interiorul Vagabond Barbershop"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </motion.div>
      </motion.section>

      <motion.section
        className="bg-secondary text-secondary-foreground py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-playfair mb-12 text-center"
            variants={fadeInUpVariants}
          >
            De ce să alegi Vagabond?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              "Expertiză tradițională",
              "Atmosferă vintage",
              "Produse premium",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                className="text-center"
                variants={fadeInUpVariants}
              >
                <h3 className="text-xl font-bold mb-4">{feature}</h3>
                <p>
                  {index === 0
                    ? "Bărbieri cu experiență care stăpânesc arta clasică a bărbieritului."
                    : index === 1
                    ? "Un decor ce te transportă în epoca de aur a frizeriilor de cartier."
                    : "Folosim doar cele mai bune produse pentru îngrijirea părului și a bărbii."}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-playfair text-primary mb-12 text-center"
            variants={fadeInUpVariants}
          >
            Serviciile noastre
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {services.length === 0 && (
              <p className="text-center text-foreground text-lg">
                Momentan nu sunt servicii disponibile.
              </p>
            )}
            {services && services.length > 0 && services.map((service) => (
              <motion.div
                key={service.id}
                className="bg-muted p-8 rounded-lg text-center shadow-md"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-5xl mb-6 block">
                  {service.name.includes("Tuns")
                    ? "✂️"
                    : service.name.includes("Bărba")
                    ? "🪒"
                    : "💈"}
                </span>
                <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                <p className="text-foreground text-lg">{service.price} RON</p>
                <p className="text-foreground text-sm mt-2">
                  {service.duration} minute
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-24"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <div className="container mx-auto px-4">
          <motion.h2
            className="text-3xl md:text-4xl font-playfair mb-12 text-center"
            variants={fadeInUpVariants}
          >
            Ce spun clienții noștri
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {testimonials && testimonials.length === 0 && (
              <p className="text-center text-foreground text-lg">
                Momentan nu sunt testimoniale disponibile.
              </p>
            )}
            {testimonials &&
              testimonials.map((testimonial) => (
                <motion.div
                  key={testimonial.id}
                  className="bg-secondary p-8 rounded-lg shadow-lg"
                  variants={fadeInUpVariants}
                >
                  <p className="mb-6 text-lg italic">
                    &quot;{testimonial.content}&quot;
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">
                      {testimonial.user.name}
                    </span>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, index) => (
                          <StarIcon
                            key={index}
                            className="w-5 h-5 fill-current text-yellow-400"
                          />
                        )
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="py-24 bg-muted"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-playfair text-primary mb-8"
            variants={fadeInUpVariants}
          >
            Gata să experimentezi Vagabond?
          </motion.h2>
          <motion.p
            className="text-foreground mb-12 text-lg max-w-2xl mx-auto"
            variants={fadeInUpVariants}
          >
            Programează-te acum și descoperă diferența unui serviciu de
            calitate. Echipa noastră te așteaptă pentru o experiență de neuitat.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={fadeInUpVariants}
          >
            <Link
              href="/programare"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md text-lg font-semibold hover:bg-primary/90 transition-colors inline-block"
            >
              Rezervă o programare
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
