"use client";

import Image from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import heroImage from "@/public/images/hero.png";
import { motion } from "framer-motion";

const services = [
  { name: "Tuns", price: "50 RON", icon: "✂️" },
  { name: "Bărbierit", price: "40 RON", icon: "🪒" },
  { name: "Aranjat barbă", price: "30 RON", icon: "💈" },
];

const testimonials = [
  {
    name: "Alexandru P.",
    quote: "Cel mai bun loc pentru un tuns și o experiență relaxantă.",
    rating: 5,
  },
  {
    name: "Mihai D.",
    quote: "Atenția la detalii este impresionantă. Recomand cu încredere!",
    rating: 5,
  },
  {
    name: "Cristian B.",
    quote:
      "Atmosfera vintage și serviciile de top mă aduc înapoi de fiecare dată.",
    rating: 5,
  },
];

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <motion.section 
        className="container mx-auto px-4 py-24 md:py-32 flex flex-col md:flex-row items-center"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.2 } }
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
        <motion.div
          className="md:w-1/2"
          variants={fadeInUpVariants}
        >
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
          visible: { transition: { staggerChildren: 0.2 } }
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
          visible: { transition: { staggerChildren: 0.2 } }
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
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                className="bg-muted p-8 rounded-lg text-center shadow-md"
                variants={fadeInUpVariants}
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-5xl mb-6 block">{service.icon}</span>
                <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                <p className="text-foreground text-lg">{service.price}</p>
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
          visible: { transition: { staggerChildren: 0.2 } }
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
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-secondary p-8 rounded-lg shadow-lg"
                variants={fadeInUpVariants}
              >
                <p className="mb-6 text-lg italic">"{testimonial.quote}"</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">
                    {testimonial.name}
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
          visible: { transition: { staggerChildren: 0.2 } }
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
            calitate. Echipa noastră te așteaptă pentru o experiență de
            neuitat.
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