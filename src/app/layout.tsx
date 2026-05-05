import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TourAssist - Experience Victoria Falls",
  description: "Discover authentic places, hidden gems, and meaningful experiences tailored to your personal intent in Victoria Falls.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
