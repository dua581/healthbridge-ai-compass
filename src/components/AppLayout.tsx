import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Footer } from "./Footer";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 animate-in fade-in duration-500">{children}</main>
        <Footer />
      </div>
    </div>
  );
}