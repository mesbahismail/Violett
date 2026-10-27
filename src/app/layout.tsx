import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  variable: "--font-inter",
  src: [
    { path: "../../public/fonts/inter-400.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/inter-500.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/inter-600.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/inter-700.ttf", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Violett — SaaS workspace",
  description:
    "A polished, dark SaaS dashboard template for your team, analytics, and customers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
