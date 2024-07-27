import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async session({ token, session }) {
      if (token && token.sub) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture;
        session.user.roles = token.roles as string[];
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }

      const dbUser = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          roles: true,
          permissions: true,
        },
      });

      if (dbUser) {
        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.image;
        token.roles = dbUser.roles;
        token.permissions = dbUser.permissions;
      }

      return token;
    },
  },
});