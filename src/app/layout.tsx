import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "AI WorkLab",
    template: "%s | AI WorkLab",
  },
  description: "Scenario-based AI practice for business professionals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[var(--color-page)] text-[var(--color-navy)]">
        {children}
      </body>
    </html>
  );
}
