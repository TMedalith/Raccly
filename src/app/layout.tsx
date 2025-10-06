import type { Metadata } from "next";
import { Nunito, Orbitron, Space_Grotesk, Rajdhani } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/shared/components/ConditionalLayout";
import { ResearchProvider } from "@/shared/contexts/ResearchContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Memora Lab - Intelligence for Discovery",
  description: "Intelligent exploration of scientific literature with AI-powered research tools",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${nunito.variable} ${orbitron.variable} ${spaceGrotesk.variable} ${rajdhani.variable} antialiased`}>
        <ResearchProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster position="top-right" richColors />
        </ResearchProvider>
      </body>
    </html>
  );
}
