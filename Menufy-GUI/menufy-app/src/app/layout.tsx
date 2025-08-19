import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/toast-provider";

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
          <body>
            <ToastProvider>
              {children}
            </ToastProvider>
          </body>
      </html>
  );
}
