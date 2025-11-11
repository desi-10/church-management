/* biome-disable @typescript-biome/no-explicit-any */
import type { AdapterUser } from "next-auth/adapters";
import type { Session, User, Account } from "next-auth";
import type { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";

type CustomJWT = JWT & {
  accessTokenExpires?: number;
  refreshTokenExpires?: number;
};
import authConfig from "@/auth.config";

// Token lifetimes
const ACCESS_TOKEN_EXPIRES_IN = 5 * 60; // 5 minutes
const REFRESH_TOKEN_EXPIRES_IN = 60 * 60 * 24 * 7; // 1 week

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  unstable_update,
} = NextAuth({
  pages: {
    signIn: "/dashboard/",
    error: "/auth/error",
    signOut: "/",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;
      if (!user.id) return false;
      return true;
    },

    // ⏳ Session logic (check expiry)
    async session({
      session,
      token,
    }: {
      session: Session;
      token: CustomJWT;
    }): Promise<Session> {
      const now = Math.floor(Date.now() / 1000);

      if (token.refreshTokenExpires && now > token.refreshTokenExpires) {
        console.log("🔒 Refresh token expired – session invalid");
        // NextAuth v5 types do not allow returning null here; handle on client
        return session;
      }

      session.user = {
        ...session.user,
        ...token,
        id: token.sub,
      };

      return session;
    },

    // 🔐 JWT logic (issue & rotate tokens)
    async jwt({
      token,
      user,
      account,
    }: {
      token: CustomJWT;
      user?: User | AdapterUser;
      account?: Account | null;
    }): Promise<CustomJWT> {
      const now = Math.floor(Date.now() / 1000);

      // Initial sign-in: attach tokens
      if (user || account) {
        const refreshTokenExpires = now + REFRESH_TOKEN_EXPIRES_IN;
        const accessTokenExpires = now + ACCESS_TOKEN_EXPIRES_IN;

        // const existingUser = await getUserById(user?.id || token.sub);
        // if (!existingUser) return token;
        // const existingAccount = await getAccountByUserId(existingUser.id);

        return {
          ...token,
          //   ...existingUser,
          //   isOAuth: !!existingAccount,
          accessTokenExpires,
          refreshTokenExpires,
        };
      }

      // Access token expired, but refresh is still valid → rotate it
      if (
        token.accessTokenExpires &&
        now > token.accessTokenExpires &&
        token.refreshTokenExpires &&
        now < token.refreshTokenExpires
      ) {
        console.log("♻️ Access token expired – rotating");
        token.accessTokenExpires = now + ACCESS_TOKEN_EXPIRES_IN;
      }

      return token;
    },
  },

  //   adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
    maxAge: REFRESH_TOKEN_EXPIRES_IN, // total session max
  },

  ...authConfig,
});
