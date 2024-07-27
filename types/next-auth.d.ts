/* /types/next-auth.d.ts */
import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      roles: string[];
      permissions: string[];
    } & DefaultSession["user"]
  }

  interface User {
    roles: string[];
    permissions: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: string[];
    permissions: string[];
  }
}