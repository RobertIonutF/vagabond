import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Playfair_Display, Roboto, Dancing_Script } from "next/font/google";
import Navbar from "@/components/navbar/navbar";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

export const revalidate = 30;

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});
const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});
const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "Vagabond Barbershop",
  description: "Experimentați arta îngrijirii la Vagabond Barbershop",
};

export default function RootLayout({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <SessionProvider>
    <html lang="ro" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${roboto.variable} ${dancingScript.variable} font-sans`}
      >

          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <footer className="py-8">
              <div className="container mx-auto text-center">
                <p>
                  &copy; {new Date().getFullYear()} Vagabond. Toate drepturile
                  rezervate.
                </p>
              </div>
            </footer>
            <Toaster />
          </ThemeProvider>
      </body>
    </html>
    </SessionProvider>
  );
}
