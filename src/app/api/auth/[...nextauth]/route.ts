import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Rate limiting is applied inside authOptions.callbacks via lib/ratelimit
// NextAuth itself handles the routing
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
