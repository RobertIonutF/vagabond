// app/programare/rating-testimonial-form.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { submitRatingAndTestimonial } from "./actions/submit-rating-testimonial";

const formSchema = z.object({
  rating: z.number().min(1).max(5),
  testimonial: z.string().min(10, {
    message: "Testimonialul trebuie să aibă cel puțin 10 caractere.",
  }).max(200, {
    message: "Testimonialul nu poate depăși 200 de caractere.",
  }),
});

type RatingTestimonialFormProps = {
  appointmentId: string;
};

export function RatingTestimonialForm({ appointmentId }: RatingTestimonialFormProps) {
  const [rating, setRating] = useState(0);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      testimonial: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await submitRatingAndTestimonial(appointmentId, values.rating, values.testimonial);
      toast({
        title: "Mulțumim pentru feedback!",
        description: "Evaluarea și testimonialul dvs. au fost înregistrate cu succes.",
      });
      form.reset();
      setRating(0);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la trimiterea feedback-ului. Vă rugăm să încercați din nou.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Evaluare</FormLabel>
              <FormControl>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer ${
                        star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => {
                        setRating(star);
                        field.onChange(star);
                      }}
                    />
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="testimonial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Testimonial</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Împărtășiți-ne experiența dvs. la Vagabond Barbershop"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Trimite feedback</Button>
      </form>
    </Form>
  );
}