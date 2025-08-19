'use client'

import React, { useContext, useEffect, useState } from "react";
import { AuthState } from "@/lib/AuthState";
import { useToast } from "./toast-provider";
import Button from "./login/Button";
import Input from "./login/Input";
import Label from "./login/Label";
import { loginUser } from "@/app/services/authService";
import { useRouter } from "next/navigation";

const LoginComponent = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const { showToast } = useToast();

  const router = useRouter();

  useEffect(() => {
      if (localStorage.getItem("auth") != null) {
      router.replace("/");
      }
  }, [localStorage.getItem("auth"), router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    try{
      const response = await loginUser({ username, password });
      const authState: AuthState = {
          user: {
            id: response.user.id,
            username: response.user.username,
          },
          company: response.user.company,
          role: response.user.role,
          accessToken: response.accessToken,
          expiresIn: response.expiresIn,
        };
      localStorage.setItem("auth",JSON.stringify(authState));
      showToast(`Login successful. Welcome, "${response.user.username}"`, "success");
    } catch(err){
      showToast(`Login unsuccessful. ${err}`, "error");
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-5xl font-bold text-center text-gray-800 mb-4">
          📜 Menufy
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 pt-8">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              type="username"
              id="username"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div>
            <Button type="submit">Sign In</Button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
        <div className="mt-6 text-center">
          <a
            href="#"
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;