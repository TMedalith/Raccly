import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ConditionalLayout } from "@/shared/components/ConditionalLayout";
import { ResearchProvider } from "@/shared/contexts/ResearchContext";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Memora Lab - Research AI",
  description: "Exploración inteligente de literatura científica",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} antialiased`}>
        <ResearchProvider>
          <ConditionalLayout>{children}</ConditionalLayout>
          <Toaster position="top-right" richColors />
        </ResearchProvider>
      </body>
    </html>
  );
}
