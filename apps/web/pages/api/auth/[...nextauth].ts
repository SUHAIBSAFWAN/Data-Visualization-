import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import supabase from "../../../lib/supabaseAdmin"; // ✅ relative import to lib

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      // Only run on first login
      if (user?.email && !token.role) {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("email", user.email)
          .single();

        if (error) {
          console.error("Supabase role fetch error:", error.message);
        }

        token.role = data?.role ?? "EMPLOYEE"; // fallback to EMPLOYEE
      }
      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.role = token.role as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
