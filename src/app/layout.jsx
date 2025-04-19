import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import ToastProvider from "@/components/ToastProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CertifyTrack",
  description: "Track and manage your certifications",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50`}
        suppressHydrationWarning
      >
        <ToastProvider />
        <Navbar />
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}
