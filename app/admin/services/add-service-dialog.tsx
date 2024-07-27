// app/admin/services/add-service-dialog.tsx
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { addService } from "./actions/add-service"
import { useToast } from "@/components/ui/use-toast"
import { PlusCircle } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Numele serviciului trebuie să aibă cel puțin 2 caractere.",
  }),
  price: z.number().min(0, {
    message: "Prețul trebuie să fie un număr pozitiv.",
  }),
  duration: z.number().int().min(1, {
    message: "Durata trebuie să fie un număr întreg pozitiv.",
  }),
})

export function AddServiceDialog() {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      duration: 30,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      await addService(values)
      toast({
        title: "Serviciu adăugat",
        description: "Noul serviciu a fost adăugat cu succes.",
      })
      setOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Eroare",
        description: "A apărut o eroare la adăugarea serviciului.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Adaugă Serviciu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adaugă serviciu nou</DialogTitle>
          <DialogDescription>
            Completați detaliile pentru noul serviciu. Apăsați salvare când ați terminat.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nume</FormLabel>
                  <FormControl>
                    <Input placeholder="Nume serviciu" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preț (RON)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseFloat(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durată (minute)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Se adaugă..." : "Adaugă serviciul"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}