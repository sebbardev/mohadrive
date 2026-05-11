import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email et mot de passe requis");
        }

        try {
          const API_URL = "https://www.mohadrive.com/api";
          const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email.toLowerCase(),
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Identifiants invalides");
          }

          const { user, access_token } = await response.json();

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            accessToken: access_token,
            profileImage: user.profile_image || null,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erreur de connexion");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: sessionUpdate }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.accessToken = (user as any).accessToken;
        token.profileImage = (user as any).profileImage || null;
      }
      if (trigger === 'update') {
        if (sessionUpdate?.profileImage !== undefined) token.profileImage = sessionUpdate.profileImage;
        if (sessionUpdate?.name !== undefined) token.name = sessionUpdate.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).profileImage = token.profileImage || null;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};

