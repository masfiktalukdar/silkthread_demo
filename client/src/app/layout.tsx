
import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./font";
import NextTopLoader from "nextjs-toploader";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Silk Thread | Best E-commerce Platform in BD",
  description: "Best E-commerce Platform in BD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-[#FAF9F6] text-gray-900`}>
        <NextTopLoader showSpinner={false} color="#FF6C0C" />
        <LanguageProvider>
          {children}
          </LanguageProvider>
       
      </body>
    </html>
  );
}
