import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "JobFit - AI Resume Matcher",
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
        className={`${jakarta.variable} ${spaceMono.variable} antialiased`}
      >
        {/* Header - Minimal & Flat */}
        <header className="sticky top-0 z-50 bg-transparent backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            {/* Logo - Text Only */}
            <a href="/" className="group">
              <span className="text-2xl font-bold bg-gradient-to-r from-coral-500 to-rose-500 bg-clip-text text-transparent transition-opacity hover:opacity-80">JobFit</span>
            </a>

            {/* Navigation */}
            <nav className="hidden items-center gap-10 md:flex">
              <a
                href="/analyze"
                className="text-sm font-medium text-stone-700 transition-colors hover:text-coral-600"
              >
                Analyze
              </a>
              <a
                href="/result"
                className="text-sm font-medium text-stone-700 transition-colors hover:text-coral-600"
              >
                Results
              </a>
              <a
                href="/analyze"
                className="rounded-full bg-gradient-to-r from-coral-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:scale-105"
              >
                Get Started
              </a>
            </nav>
            <a
              href="/analyze"
              className="rounded-full bg-coral-500 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-coral-600 md:hidden"
            >
              Start
            </a>
          </div>
        </header>

        {/* Main content */}
        <div className="min-h-[calc(100vh-180px)]">
          {children}
        </div>

        {/* Footer */}
        <footer className="mt-20 border-t border-stone-200/60 bg-white/75 backdrop-blur">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="grid gap-8 md:grid-cols-3">
              {/* Brand */}
              <div>
                <div className="mb-3">
                  <span className="font-bold text-xl bg-gradient-to-r from-coral-500 to-rose-500 bg-clip-text text-transparent">JobFit</span>
                </div>
                <p className="max-w-xs text-sm text-stone-600">
                  AI-powered resume matching that helps you understand your fit before you apply.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-stone-900">
                  Quick Links
                </h3>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li>
                    <a href="/" className="transition-colors hover:text-coral-600">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/analyze" className="transition-colors hover:text-coral-600">
                      Analyze
                    </a>
                  </li>
                  <li>
                    <a href="/result" className="transition-colors hover:text-coral-600">
                      Sample Results
                    </a>
                  </li>
                </ul>
              </div>

              {/* About */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-stone-900">
                  Technology
                </h3>
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1 text-xs text-stone-600">
                    Next.js
                  </span>
                  <span className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1 text-xs text-stone-600">
                    TypeScript
                  </span>
                  <span className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1 text-xs text-stone-600">
                    OpenAI API
                  </span>
                  <span className="rounded-lg border border-stone-200 bg-white/80 px-3 py-1 text-xs text-stone-600">
                    Tailwind CSS
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-stone-200/60 pt-8 text-sm text-stone-600 md:flex-row">
              <p>JobFit by Jenna Park · Personal project</p>
              <p className="text-xs">
                Built with Next.js, TypeScript, and OpenAI API
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}