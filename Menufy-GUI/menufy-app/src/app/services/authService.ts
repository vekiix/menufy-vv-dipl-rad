import axiosInstance, { axios } from "./axios";
import { cookies } from "next/headers";

interface LoginData {
  username: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  company: string;
  role: string;
}

interface LoginSuccessResponse {
  createdAt: Date;
  tokenType: string;
  user: User;
  expiresIn: number;
  accessToken: string;
  scope: string;
}

interface ErrorDetail {
  path: string;
  httpStatus: number;
  detail: string;
  timestamp: string;
}

interface LoginErrorResponse {
  errors: ErrorDetail[];
}

export const loginUser = async (credentials: LoginData): Promise<LoginSuccessResponse> => {

  try {
    const response = await axiosInstance.post<LoginSuccessResponse>("/login", credentials, {
      headers: {
        "Content-Type": "application/json",
        Accept: "*/*",
      },
    });

    if (response.status === 200 && response.data.accessToken) {
        const { user, accessToken, tokenType, expiresIn, scope } = response.data;
        console.log("Login successful. Auth context updated.");
      return response.data;
    } else {
      throw new Error("Unexpected response format from login endpoint.");
    }
  } catch (error) {
if (axios.isAxiosError(error)) {
      const apiErrors = error.response?.data as LoginErrorResponse;
      if (apiErrors?.errors?.length > 0) {
        const errorMessages = apiErrors.errors.map((err) => `${err.detail} (status: ${err.httpStatus})`).join(" | ");
        throw new Error(errorMessages);
      } else {
        throw new Error("An unknown API error occurred during login.");
      }
    } else {
      throw new Error("A network or unexpected error occurred during login.");
    }
  }
};