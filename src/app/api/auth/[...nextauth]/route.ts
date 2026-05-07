import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET ?? "sensante-secret-lab-glsi-2025",
});

export { handler as GET, handler as POST };
