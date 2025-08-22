import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, loginGuest } from "@/lib/services/auth-service";
import { AxiosError } from "axios";



const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required");
        }

        try {
          const response = await loginUser({
            username: credentials.username,
            password: credentials.password,
          });

          return {
            id: response.user.id,
            name: response.user.username,
            email: response.user.username, // Using username as email for NextAuth
            role: response.user.role,
            companyId: response.company.id,
            company: response.company.name,
            accessToken: response.accessToken,
            expiresIn: response.expiresIn,
          };
        } catch (error) {
          console.log(error);
          if (error instanceof AxiosError) {
            const errorData = error.response?.data;
            if (errorData?.errors && errorData.errors.length > 0) {
              // Extract the actual error detail from the backend response
              const backendError = errorData.errors[0].detail || 'Authentication failed';
              // Encode the custom error message into the error itself
              // NextAuth will pass this through as the error parameter
              throw new Error(encodeURIComponent(backendError));
            }
            // Fallback for other axios errors
            throw new Error(encodeURIComponent(error.response?.statusText || 'Authentication failed'));
          }
          if(error instanceof AggregateError){
            const errorData = error.errors[0];
            if(errorData.message){
              throw new Error(encodeURIComponent(errorData.message));
            }
          }
          throw new Error(encodeURIComponent("Login failed for unknown reason"));
        }
      },
    }),
    CredentialsProvider({
      id: "guest",
      name: "guest",
      credentials: {
        uid: { label: "UID", type: "text" },
        ctr: { label: "CTR", type: "text" },
        cmac: { label: "CMAC", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.uid || !credentials?.ctr || !credentials?.cmac) {
          throw new Error("Missing required guest login parameters");
        }

        try {
          const response = await loginGuest(credentials.uid, credentials.ctr, credentials.cmac);
          return {
            id: response.guest.CMAC,
            name: `Guest-${response.guest.CMAC}`,
            email: `guest-${response.guest.CMAC}@menufy.com`,
            role: response.guest.role,
            companyId: response.company.id,
            company: response.company.name,
            accessToken: response.accessToken,
            expiresIn: response.expiresIn,
          };
        } catch (error) {
          console.log(error);
          if (error instanceof AxiosError) {
            const errorData = error.response?.data;
            if (errorData?.errors && errorData.errors.length > 0) {
              const backendError = errorData.errors[0].detail || 'User authentication failed';
              throw new Error(encodeURIComponent(backendError));
            }
            throw new Error(encodeURIComponent(error.response?.statusText || 'User authentication failed'));
          }
          if(error instanceof AggregateError){
            const errorData = error.errors[0];
            if(errorData.message){
              throw new Error(encodeURIComponent(errorData.message));
            }
          }
          throw new Error(encodeURIComponent("Login failed for unknown reason"));
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.companyId = user.companyId;
        token.company = user.company;
        token.accessToken = user.accessToken;
        token.expiresIn = user.expiresIn;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
        session.user.companyId = token.companyId as string;
        session.user.company = token.company as string;
        session.accessToken = token.accessToken as string;
        session.expiresIn = token.expiresIn as number;
      }
      return session; // Return session, not token
    },
    async redirect({ url, baseUrl }) {
      // If the url is relative, prefix it with the base url
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // If the url is on the same origin, allow it
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({}) {
      // This callback runs after successful authentication
      // If we reach here, authentication was successful
      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login", // Redirect errors back to login page with URL parameters
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
