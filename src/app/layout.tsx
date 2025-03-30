import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeeTube",
  description: "A Youtube clone built by Zuhayr Tariq using Next 15.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl={"/"}>
      <html lang="en">
        <body className={`${inter.className}  antialiased`}>
          <TRPCProvider>
            {children}
            <NextTopLoader />
            <Toaster />
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
