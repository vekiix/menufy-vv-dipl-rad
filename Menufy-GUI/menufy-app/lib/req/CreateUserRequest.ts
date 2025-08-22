// CreateUserRequest.ts

export interface CreateUserRequest {
  username: string;
  password: string;
  companyId: string; // UUID as a string
  roleId: number;
}
