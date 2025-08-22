// CreateUserRequest.ts

export interface CreateCompanyRequest {
  companyName: string;
  oib: string;
  encryptionKey: string; // UUID as a string
  logo: string;
}
