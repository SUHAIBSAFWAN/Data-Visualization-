import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import supabase from "../../../lib/supabaseAdmin"; // ✅ admin client for secure fetching

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // Log initial token and user
      console.log("🔑 [jwt] user:", user?.email);
      console.log("🔑 [jwt] before token.role:", token.role, "token.id:", token.id);

      if (user?.email && (!token.role || !token.id)) {
        const { data, error } = await supabase
          .from("users")
          .select("role, id")
          .eq("email", user.email)
          .single();

        if (error || !data) {
          console.error("❌ Supabase fetch error:", error?.message || "User not found in DB");
        }

        token.role = data?.role ?? "EMPLOYEE";
        token.id = data?.id ?? null;

        console.log("✅ [jwt] Updated token.role:", token.role, "token.id:", token.id);
      }

      return token;
    },

    async session({ session, token }) {
      // Attach role and id to session
      session.user.role = token.role as string;
      session.user.id = token.id as string;

      console.log("🧠 [session] role:", session.user.role, "id:", session.user.id);

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
