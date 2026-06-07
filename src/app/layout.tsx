import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Zap } from "lucide-react";

import { AuthProvider } from "@/lib/contexts/AuthContext";
import { CollegeProvider } from "@/lib/contexts/CollegeContext";
import { ThemeProvider } from "@/lib/contexts/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "KCET Predictor",
  description: "The most accurate and premium college prediction platform for KCET aspirants.",
  verification: {
    google: "googlec241161ab16e5be3",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
        <ThemeProvider>
        <AuthProvider>
          <CollegeProvider>
            <main>{children}</main>
          </CollegeProvider>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
