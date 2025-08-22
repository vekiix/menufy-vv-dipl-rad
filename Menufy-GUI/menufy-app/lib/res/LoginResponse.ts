import { Guest } from "../models/Guest";
import { User } from "../models/User";
import { CompanyDto } from "./CompanyDto";

export interface LoginResponse {
  createdAt: Date;
  tokenType: string;
  user: User;
  company: CompanyDto
  expiresIn: number;
  accessToken: string;
  scope: string;
}

export interface LoginGuestResponse {
  createdAt: Date;
  tokenType: string;
  guest: Guest;
  company: CompanyDto
  expiresIn: number;
  accessToken: string;
  scope: string;
}