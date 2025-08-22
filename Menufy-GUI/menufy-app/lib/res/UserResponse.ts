// UserResponse.ts

export interface UserResponse {
  user: ResUserObject;
}

export interface ResUserObject {
    id: string;
    username: string;
    password: string;
    company: Company;
    role: Role;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    authorities: Authority[];
    credentialsNonExpired: boolean;
    accountNonExpired: boolean;
    accountNonLocked: boolean;
    enabled: boolean;
}

export interface Company {
  id: string;
  companyName: string;
  oib: string;
  encryptionKey: string;
  logo: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Role {
  id: number;
  roleName: string;
  roleIdentifier: string;
  roleDescription: string;
}

export interface Authority {
  authority: string;
}
