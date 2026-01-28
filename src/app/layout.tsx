import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Pocket Ops Board",
  description:
    "Internal dashboard for incidents, deploy notes, and quick checks.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen">
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <h1 className="text-xl font-semibold">Pocket Ops Board</h1>
                <p className="text-sm text-slate-500">
                  Runtimes, deploys, and the usual fires.
                </p>
              </div>
              <div className="text-xs text-slate-400">v0.3 internal</div>
            </div>
          </header>
          <main className="mx-auto grid max-w-6xl gap-6 px-6 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
