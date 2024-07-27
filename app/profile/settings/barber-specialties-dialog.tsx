// app/profile/barber-specialties-dialog.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateBarberSpecialties } from "./actions/update-specialities";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const formSchema = z.object({
  specialty: z.string().min(2, {
    message: "Specialitatea trebuie să aibă cel puțin 2 caractere.",
  }),
});

interface BarberSpecialtiesDialogProps {
  barberId: string;
  initialSpecialties: string[];
}

export function BarberSpecialtiesDialog({ barberId, initialSpecialties }: BarberSpecialtiesDialogProps) {
  const [open, setOpen] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>(initialSpecialties);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      specialty: "",
    },
  });

  const addSpecialty = (specialty: string) => {
    if (!specialties.includes(specialty)) {
      setSpecialties([...specialties, specialty]);
    }
    form.reset();
  };

  const removeSpecialty = (specialty: string) => {
    setSpecialties(specialties.filter((s) => s !== specialty));
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    addSpecialty(values.specialty);
  };

  const saveSpecialties = async () => {
    setIsLoading(true);
    try {
      await updateBarberSpecialties(barberId, specialties);
      toast({
        title: "Specialități actualizate",
        description: "Specialitățile tale au fost actualizate cu succes.",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la actualizarea specialităților.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Setează Specialitățile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Setează Specialitățile</DialogTitle>
          <DialogDescription>
            Adaugă sau elimină specialitățile tale de frizer aici.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-wrap gap-2 my-4">
          {specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary">
              {specialty}
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 h-auto p-0"
                onClick={() => removeSpecialty(specialty)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="specialty"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialitate Nouă</FormLabel>
                  <FormControl>
                    <Input placeholder="Adaugă o specialitate" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Adaugă Specialitate</Button>
          </form>
        </Form>
        <DialogFooter>
          <Button onClick={saveSpecialties} disabled={isLoading}>
            {isLoading ? "Se salvează..." : "Salvează Specialitățile"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}