'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from './actions/update-profile';
import { useToast } from "@/components/ui/use-toast";
import { BarberSpecialtiesDialog } from './barber-specialties-dialog';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Numele trebuie să aibă cel puțin 2 caractere.",
  }),
  email: z.string().email({
    message: "Adresa de email nu este validă.",
  }),
  phoneNumber: z.string().regex(/^(\+4|)?(07[0-8]{1}[0-9]{1}|02[0-9]{2}|03[0-9]{2}){1}?(\s|\.|\-)?([0-9]{3}(\s|\.|\-|)){2}$/, {
    message: "Numărul de telefon nu este valid.",
  }),
});

type SettingsFormProps = {
  initialData: {
    name: string | null;
    email: string | null;
    phoneNumber: string | null;
  };
  userId: string;
  isBarber: boolean;
  barberSpecialties: string[];
};

export default function SettingsForm({ initialData, userId, isBarber, barberSpecialties }: SettingsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || '',
      email: initialData.email || '',
      phoneNumber: initialData.phoneNumber || '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      await updateUserProfile(userId, values);
      toast({
        title: "Profil actualizat",
        description: "Datele tale au fost actualizate cu succes.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea profilului. Te rugăm să încerci din nou.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nume</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Număr de telefon</FormLabel>
              <FormControl>
                <Input {...field} type="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant={"ghost"} type="submit" disabled={isSubmitting} className="w-full bg-burnt-orange hover:bg-mustard-yellow text-white">
          {isSubmitting ? "Se actualizează..." : "Actualizează profilul"}
        </Button>
      </form>
      {isBarber && (
        <div className="mt-6">
          <BarberSpecialtiesDialog barberId={userId} initialSpecialties={barberSpecialties} />
        </div>
      )}
    </Form>
  );
}