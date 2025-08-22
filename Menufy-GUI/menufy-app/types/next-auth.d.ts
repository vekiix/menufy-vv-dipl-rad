import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      companyId: string;
      company: string;
    };
    accessToken: string;
    expiresIn: number;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    company: string;
    accessToken: string;
    expiresIn: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    companyId: string;
    company: string;
    accessToken: string;
    expiresIn: number;
  }
}


