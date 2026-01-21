import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobFit",
  description: "AI-driven resume and job description matching tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
      >
        <header
          className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
            <a href="/" className="font-semibold" style={{ color: "var(--foreground)" }}>
              JobFit
            </a>
            <nav className="text-sm">
              <a
                className="underline"
                style={{ color: "var(--accent)" }}
                href="/analyze"
              >
                Analyze
              </a>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </body>
    </html>
  );
}
