import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SomaSync VR — Neuro-Kinetic Behavioral Health System",
  description: "An adaptive, closed-loop mind-body digital therapeutic built for Challenge 09: Sustaining Healthy Behaviors."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
        {children}
      </body>
    </html>
  );
}
