export interface AuthState {
    user?: {
      id: string;
      username: string;
    };
    guest?: {
      CMAC: string;
      table: string;
    }
    createdAt?: Date;
    company?: string;
    role?: string;
    accessToken?: string;
    expiresIn?: number;
  }