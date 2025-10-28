import type { Metadata } from "next";
import { Geist } from 'next/font/google'

import "./globals.css";

const geist = Geist({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "Frontend Challenge | YouTube Clone",
  description: "A YouTube clone built with Next.js, TypeScript, and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.className} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
