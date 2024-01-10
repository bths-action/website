import { AuthOptions } from "next-auth";
import Auth0Provider, { Auth0Profile } from "next-auth/providers/auth0";

export const AUTH_OPTIONS: AuthOptions = {
  callbacks: {
    async signIn({ user }) {
      if (
        user.email?.endsWith("@nycstudents.net") ||
        user.email?.endsWith("@schools.nyc.gov") ||
        user.email === "coder2195mail@gmail.com"
      )
        return true;

      return "/auth/invalid-email";
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
