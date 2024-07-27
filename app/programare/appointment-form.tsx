// app/programare/appointment-form.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { createAppointment } from "./actions/create-appointment";
import { fetchAvailableSlots } from "./actions/fetch-available-slots";
import { fetchAvailableDates } from "./actions/fetch-available-dates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { startOfMonth } from "date-fns";
import ServiceSelection from "./service-selection";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  barberId: z.string({
    required_error: "Vă rugăm să selectați un frizer.",
  }),
  date: z.date({
    required_error: "Vă rugăm să selectați o dată.",
  }),
  time: z.string({
    required_error: "Vă rugăm să selectați o oră.",
  }),
  services: z
    .array(z.string())
    .nonempty("Vă rugăm să selectați cel puțin un serviciu."),
  extraInfo: z.string().optional(),
});

type Barber = {
  id: string;
  userId: string;
  name: string | null;
  image: string | null;
  specialties: string[];
};

type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
};

type AppointmentFormProps = {
  barbers: Barber[];
  services: Service[];
};

export default function AppointmentForm({
  barbers,
  services,
}: AppointmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      services: [],
      extraInfo: "",
    },
  });

  const selectedBarberId = form.watch("barberId");
  const selectedDate = form.watch("date");

  useEffect(() => {
    if (selectedBarberId) {
      fetchAvailableDates(selectedBarberId, startOfMonth(new Date()))
        .then((dates) => setAvailableDates(dates))
        .catch((err) => console.error("Error fetching available dates:", err));
    }
  }, [selectedBarberId]);

  useEffect(() => {
    if (selectedBarberId && selectedDate) {
      fetchAvailableSlots(selectedBarberId, selectedDate)
        .then((slots) => setAvailableSlots(slots))
        .catch((err) => console.error("Error fetching available slots:", err));
    }
  }, [selectedBarberId, selectedDate]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await createAppointment(values);
      if (result.success) {
        toast({
          title: "Programare creată cu succes",
          description: "Programarea ta a fost înregistrată.",
        });
        form.reset();
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "A apărut o eroare la crearea programării. Vă rugăm să încercați din nou."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {barbers.length > 0 ? (
           <FormField
           control={form.control}
           name="barberId"
           render={({ field }) => (
             <FormItem>
               <FormLabel>Frizer</FormLabel>
               <FormControl>
                 <RadioGroup
                   onValueChange={(value) => {
                     field.onChange(value);
                     form.setValue("time", "");
                   }}
                   defaultValue={field.value}
                   className="flex flex-wrap gap-4"
                 >
                   {barbers.map((barber) => (
                     <FormItem
                       key={barber.userId}
                       className="flex flex-col items-center space-y-2"
                     >
                       <FormControl>
                         <RadioGroupItem
                           value={barber.userId}
                           id={barber.userId}
                           className="peer sr-only"
                         />
                       </FormControl>
                       <label
                         htmlFor={barber.userId}
                         className="relative flex flex-col items-center justify-between rounded-lg p-4 cursor-pointer border-2 border-transparent peer-checked:border-burnt-orange peer-checked:bg-burnt-orange/10 hover:bg-muted transition-colors group"
                       >
                         <div className="absolute top-2 right-2 opacity-0 transition-opacity group-[.peer-checked]:opacity-100">
                           <CheckCircle className="w-6 h-6 text-burnt-orange" />
                         </div>
                         <Avatar className="w-24 h-24 mb-2 ring-4 ring-transparent group-[.peer-checked]:ring-burnt-orange transition-all">
                           <AvatarImage
                             src={barber.image || undefined}
                             alt={barber.name || "Barber"}
                           />
                           <AvatarFallback>
                             {barber.name?.charAt(0) || "B"}
                           </AvatarFallback>
                         </Avatar>
                         <span className="text-sm font-medium text-center">
                           {barber.name}
                         </span>
                         <span className="text-xs text-muted-foreground text-center mt-1">
                           {barber.specialties.join(", ")}
                         </span>
                       </label>
                     </FormItem>
                   ))}
                 </RadioGroup>
               </FormControl>
               <FormMessage />
             </FormItem>
           )}
         />
        ) : (
          <p className="text-center">Nu există frizeri disponibili.</p>
        )}
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  field.onChange(date);
                  form.setValue("time", "");
                }}
                disabled={(date) =>
                  date < new Date() ||
                  date >
                    new Date(new Date().setMonth(new Date().getMonth() + 1)) ||
                  !availableDates.some(
                    (availableDate) =>
                      availableDate.getDate() === date.getDate() &&
                      availableDate.getMonth() === date.getMonth() &&
                      availableDate.getFullYear() === date.getFullYear()
                  )
                }
                className="rounded-md border"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ora</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue placeholder="Selectați o oră" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicii</FormLabel>
              <FormControl>
                <ServiceSelection
                  services={services}
                  onSelectionChange={(selectedServices) =>
                    field.onChange(selectedServices)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="extraInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Informații suplimentare</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Adăugați orice informații suplimentare aici..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {barbers.length >= 0 && (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-burnt-orange hover:bg-mustard-yellow text-white"
          >
            {isSubmitting ? "Se trimite..." : "Programează"}
          </Button>
        )}
      </form>
    </Form>
  );
}
