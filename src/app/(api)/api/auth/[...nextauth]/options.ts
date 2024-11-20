import { AuthOptions } from "next-auth";
import Auth0Provider, { Auth0Profile } from "next-auth/providers/auth0";
import { prisma } from "@/utils/prisma";

export const AUTH_OPTIONS: AuthOptions = {
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (profile?.sub?.includes("discord")) {
        const s = profile.sub.split("|");
        const discordID = s[s.length - 1];
        const dUser = await prisma.user.findUnique({
          where: { discordID },
          select: { email: true },
        });
        if (!dUser) {
          return "/auth/invalid-discord";
        }
        user.email = dUser.email;
      }
      if (
        user.email?.endsWith("@nycstudents.net") ||
        user.email?.endsWith("@gmail.com") ||
        user.email?.endsWith("@schools.nyc.gov")
      )
        return true;

      return "/auth/invalid-email";
    },

    async session({ session, user, token }) {
      return session;
    },
  },
  providers: [
    Auth0Provider({
      profile(profile: Auth0Profile) {
        return {
          id: profile.sub,
          name: profile.nickname,
          email: profile.email,
          image: profile.picture,
        };
      },

      authorization: {
        params: {
          prompt: "login",
        },
      },
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER as string,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
