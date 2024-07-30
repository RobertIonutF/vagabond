import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./lib/prisma";
import NodeCache from "node-cache";

// Define the user type
interface CachedUser {
  id: string;
  email: string;
  name: string;
  password: string;
  roles: string[];
  permissions: string[];
}

// Initialize the cache
const userCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "jsmith@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        // Check if the user is in the cache
        const cachedUser = userCache.get<CachedUser>(credentials.email as string);
        if (cachedUser) {
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            cachedUser.password
          );

          if (isPasswordValid) {
            return {
              id: cachedUser.id,
              email: cachedUser.email,
              name: cachedUser.name,
              roles: cachedUser.roles,
              permissions: cachedUser.permissions,
            };
          } else {
            return null;
          }
        }

        // If user is not in the cache, query the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        // Store user in cache
        const userToCache: CachedUser = {
          id: user.id,
          email: user.email as string,
          name: user.name as string,
          password: user.password,
          roles: user.roles,
          permissions: user.permissions,
        };
        userCache.set(credentials.email as string, userToCache);

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles,
          permissions: user.permissions,
        };
      },
    }),
  ],
} satisfies NextAuthConfig;
