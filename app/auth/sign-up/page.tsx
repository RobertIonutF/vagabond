/* app/auth/sign-up/page.tsx */
"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Numele trebuie să aibă cel puțin 2 caractere.",
    }),
    email: z.string().email({
      message: "Adresa de email nu este validă.",
    }),
    password: z.string().min(8, {
      message: "Parola trebuie să aibă cel puțin 8 caractere.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Parolele nu se potrivesc.",
    path: ["confirmPassword"],
  });

export default function SignUpPage() {
  const {data : session} = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  if (session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-playfair text-leather-brown mb-8 text-center">
            Inregistrare
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Esti deja autentificat si inregistrat.
          </p>
        </div>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Here you would typically make an API call to create the user
    // For this example, we'll just simulate it with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // After creating the user, you might want to sign them in automatically
    const result = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (result?.error) {
      console.error(result.error);
      // Handle error (e.g., show error message)
    } else {
      router.push("/"); // Redirect to home page on successful sign up and sign in
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-playfair text-leather-brown mb-8 text-center">
          Înregistrare
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Nume</Label>
            <Input
              id="name"
              type="text"
              placeholder="Numele tău complet"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nume@exemplu.com"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Parolă</Label>
            <Input
              id="password"
              type="password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirmă parola</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...form.register("confirmPassword")}
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4" />}
            Înregistrare
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">Sau</p>
        </div>
        <Button
          variant="outline"
          type="button"
          className="w-full mt-4"
          onClick={() => signIn("google")}
          disabled={isLoading}
        >
          <span className="flex">
            <FaGoogle />
            oogle
          </span>
        </Button>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          Ai deja un cont?{" "}
          <a
            href="/auth/signin"
            className="text-burnt-orange hover:text-mustard-yellow"
          >
            Autentifică-te
          </a>
        </p>
      </div>
    </div>
  );
}
