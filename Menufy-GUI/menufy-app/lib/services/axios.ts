// services/httpClient.ts
import axios, { AxiosInstance } from "axios";
import { ErrorResponse } from "../res/ErrorResponse";
import { getSession } from "next-auth/react";

const createAxiosInstance = (): AxiosInstance => {

    const handleAxiosError = (error: unknown): never => {
    if (axios.isAxiosError(error)) {
        const apiErrors = error.response?.data as ErrorResponse;
        if (apiErrors?.errors?.length > 0) {
        const errorMessages = apiErrors.errors
            .map((err) => `${err.detail} (status: ${err.httpStatus})`)
            .join(" | ");
            throw new Error(errorMessages);
        } else {
            throw new Error(`${error}`);
        }
    } else {
        throw new Error(`${error}`);
    }
    };



  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:9100",
    timeout: 10000,
  });

  instance.interceptors.request.use(
    async (config) => {
      if (typeof window !== "undefined") {
        const session = await getSession();
        const token = session?.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          config.headers.Accept = "application/json";
          config.headers["Content-Type"] = "application/json";
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        throw error
      }
        
      handleAxiosError(error)
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxiosInstance();

