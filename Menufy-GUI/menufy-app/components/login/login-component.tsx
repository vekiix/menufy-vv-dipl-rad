'use client'

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useToast } from "../providers/toast-provider";
import { useApp } from "../providers/app-provider";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

const LoginContent = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { login } = useApp();

  // Handle errors and logout messages from URL parameters
  useEffect(() => {
    const urlError = searchParams.get('error');
    const customErrorMessage = searchParams.get('message');
    const logoutParam = searchParams.get('logout');
    
    // Handle logout success message
    if (logoutParam === 'true') {
      showToast("Successfully logged out", "success");
      // Clear the logout parameter from URL
      router.replace('/login', { scroll: false });
      return;
    }
    
    // Handle error messages
    if (urlError || customErrorMessage) {
      let errorMessage;
      
      if (customErrorMessage) {
        errorMessage = decodeURIComponent(customErrorMessage);
      } else if (urlError) {
        switch (urlError) {
          case 'CredentialsSignin':
            errorMessage = 'Invalid username or password. Please try again.';
            break;
          case 'CustomBackendError':
            errorMessage = 'Authentication failed. Please check your credentials.';
            break;
          case 'AccessDenied':
            errorMessage = 'Access denied. You do not have permission to access this resource.';
            break;
          default:
            // Try to decode the error message in case it contains custom text
            errorMessage = decodeURIComponent(urlError);
            break;
        }
      }

      if (errorMessage) {
        setError(errorMessage);
        showToast(errorMessage, "error");
        
        // Clear the error from URL to prevent showing it again on refresh
        router.replace('/login', { scroll: false });
      }
    }
  }, [searchParams, showToast, router]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
    
    // Use the centralized login method from the provider
    const result = await login(username, password);
    
    if (!result.success && result.error) {
      setError(result.error);
      showToast(result.error, "error");
      setIsLoading(false);
    }
    // If success, the redirect will happen automatically, so we don't need to set loading to false

  }, [login, showToast]);

  return (
          <div className="min-h-screen relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-100">
          <div className="absolute inset-0 opacity-25" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.08'%3E%3Ccircle cx='20' cy='20' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          {/* Enhanced Floating Elements */}
          <div className="absolute top-20 left-16 w-24 h-24 bg-gradient-to-r from-blue-200/30 to-blue-300/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute top-32 right-24 w-40 h-40 bg-gradient-to-r from-gray-200/25 to-slate-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-32 left-12 w-32 h-32 bg-gradient-to-r from-blue-100/40 to-indigo-200/25 rounded-full blur-2xl animate-pulse delay-500"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-r from-slate-200/30 to-gray-300/20 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-8 w-16 h-16 bg-gradient-to-r from-blue-300/20 to-blue-400/15 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute top-1/3 right-8 w-28 h-28 bg-gradient-to-r from-gray-300/20 to-slate-300/15 rounded-full blur-2xl animate-pulse delay-800"></div>
        </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white/95 backdrop-blur-xl border border-gray-200/60 rounded-3xl p-8 shadow-2xl shadow-gray-900/10 transform transition-all duration-300 hover:shadow-blue-500/20 hover:shadow-2xl hover:border-gray-300/80">
            {/* Logo Section */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-3xl blur-xl"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:scale-105 transition-all duration-300 border border-gray-200/80 hover:border-blue-300/60">
                    <Image 
                      src="/logo.png" 
                      alt="Menufy Logo" 
                      onClick={() => router.push('/')}
                      width={64}
                      height={64}
                      className="object-contain"
                      priority
                    />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text">
                Menufy
              </h1>
              <p className="text-gray-600 text-sm font-medium">
                Welcome back! Please sign in to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <Label htmlFor="username" className="text-gray-900 text-sm font-semibold mb-3 block">
                    Username
                  </Label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Enter your username"
                      required
                      disabled={isLoading}
                      className="w-full bg-gray-50/50 border border-gray-300/70 rounded-xl px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-focus-within:from-blue-500/5 group-focus-within:via-blue-500/3 group-focus-within:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <div className="group">
                  <Label htmlFor="password" className="text-gray-900 text-sm font-semibold mb-3 block">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="w-full bg-gray-50/50 border border-gray-300/70 rounded-xl px-4 py-3.5 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white hover:bg-white/80 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-focus-within:from-blue-500/5 group-focus-within:via-blue-500/3 group-focus-within:to-blue-500/5 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              <Suspense>
                {error && (
                  <div className="bg-red-50/80 border border-red-200/60 rounded-xl p-4 backdrop-blur-sm">
                    <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                  </div>
                )}
              </Suspense>

              {/* Submit Button */}
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                )}
              </Button>
            </form>

            {/* Forgot Password Link */}
            <div className="mt-8 text-center">
              <a
                href="#"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-200 hover:underline relative group"
              >
                Forgot your password?
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </a>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-xs font-medium bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
              Vedran Vidaković © 2025 Menufy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginComponent = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading login form...</p>
        </div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
};

export default LoginComponent;