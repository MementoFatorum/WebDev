import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aqbobek Portal",
  description:
    "Unified digital portal for Aqbobek Lyceum with academic monitoring, AI guidance, achievements, and school events.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
