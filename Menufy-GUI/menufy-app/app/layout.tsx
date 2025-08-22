import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/providers/toast-provider";
import { NextAuthProvider } from "@/components/providers/next-auth-provider";
import { AppProvider } from "@/components/providers/app-provider";
import LayoutWithSidebar from "@/components/navigation/layout-with-sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Menufy application",
  description: "Ordering food made easier",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NextAuthProvider>
          <AppProvider>
              <ToastProvider>
                  <LayoutWithSidebar>
                    {children}
                  </LayoutWithSidebar>
              </ToastProvider>
          </AppProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
