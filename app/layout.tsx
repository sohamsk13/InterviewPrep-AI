import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Poppins, Rubik } from "next/font/google";

import "./globals.css";

// Importing creative fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Regular, SemiBold, Bold
});

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Regular, Medium, Bold
});

export const metadata: Metadata = {
  title: "InterviewPrep AI",
  description: "An AI-powered platform for preparing for mock interviews",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${rubik.className} antialiased pattern`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
