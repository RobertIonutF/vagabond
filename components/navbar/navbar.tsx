// app/components/navbar/navbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./mode-toggle";
import { signOut, useSession } from "next-auth/react";
import logoImage from "@/public/images/logo.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/programare", label: "Programează-te" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const userInitials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  const isBarber = session?.user?.roles?.includes('barber') && session?.user?.permissions?.includes('view_appointments');
  const isAdmin = session?.user?.roles?.includes('admin');

  return (
    <nav className="sticky top-0 z-1 py-4 px-6 md:px-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link prefetch={true} href="/" className="flex items-center space-x-2">
          <Image
            src={logoImage}
            alt="Logo Vagabond Barbershop"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-playfair text-xl hidden sm:inline">
            Vagabond
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`hover:text-burnt-orange transition-colors ${
                pathname === item.href ? "text-burnt-orange" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
          {isBarber && (
            <Link
              href="/programari"
              prefetch={true}
              className={`hover:text-burnt-orange transition-colors ${
                pathname === "/programari" ? "text-burnt-orange" : ""
              }`}
            >
              Programări
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              prefetch={true}
              className={`hover:text-burnt-orange transition-colors ${
                pathname.startsWith("/admin") ? "text-burnt-orange" : ""
              }`}
            >
              Admin
            </Link>
          )}
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile/settings">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                  Deconectare
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link prefetch={true} href="/auth/sign-up" className="btn btn-primary">
                Înregistrare
              </Link>
              <Link prefetch={true} href="/auth/sign-in" className="btn btn-secondary">
                Autentificare
              </Link>
            </>
          )}
          <ModeToggle />
        </div>

        {/* Mobile Menu Button and Mode Toggle */}
        <div className="md:hidden flex items-center space-x-4">
          <ModeToggle />
          <Button
            variant="ghost"
            className="text-primary-foreground p-0"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={`block py-2 px-6 hover:bg-leather-brown hover:text-primary-foreground transition-colors ${
                pathname === item.href
                  ? "bg-leather-brown text-primary-foreground"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {isBarber && (
            <Link
              href="/programari"
              prefetch={true}
              className={`block py-2 px-6 hover:bg-leather-brown hover:text-primary-foreground transition-colors ${
                pathname === "/programari"
                  ? "bg-leather-brown text-primary-foreground"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Programări
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/admin"
              prefetch={true}
              className={`block py-2 px-6 hover:bg-leather-brown hover:text-primary-foreground transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-leather-brown text-primary-foreground"
                  : ""
              }`}
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          )}
          {status === "authenticated" ? (
            <>
              <Link
                href="/profile/settings"
                prefetch={true}
                className="block py-2 px-6 hover:bg-leather-brown hover:text-primary-foreground transition-colors"
              >
                Profil
              </Link>
              <button
                onClick={() => signOut()}
                className="block w-full text-left py-2 px-6 text-burnt-orange hover:bg-leather-brown hover:text-primary-foreground transition-colors"
              >
                Deconectare
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/sign-up"
                prefetch={true}
                className="block py-2 px-6 bg-burnt-orange text-white hover:bg-mustard-yellow transition-colors"
              >
                Înregistrare
              </Link>
              <Link
                href="/auth/sign-in"
                prefetch={true}
                className="block py-2 px-6 hover:bg-leather-brown hover:text-primary-foreground transition-colors"
              >
                Autentificare
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}