import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;  // ✅ our custom field
    };
  }

  interface JWT {
    role?: string | null;
  }
}
