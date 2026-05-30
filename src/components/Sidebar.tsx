import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, User, Shield, Building2, Settings as SettingsIcon, Home } from "lucide-react";
import { useState } from "react";
import { SettingsModal } from "./SettingsModal";

const links = [
  { to: "/", label: "Home", icon: Home },
  { to: "/user", label: "User", icon: User },
  { to: "/admin", label: "Admin", icon: Shield },
  { to: "/client", label: "Client", icon: Building2 },
] as const;

export function Sidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card p-5 md:flex">
        <Link to="/" className="mb-8 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold leading-tight text-foreground">HealthBridge</div>
            <div className="text-xs text-muted-foreground">AI · SDG 3</div>
          </div>
        </Link>

        <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Dashboards
        </div>
        <nav className="flex flex-col gap-1">
          {links.map((l) => {
            const active = path === l.to;
            const Icon = l.icon;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-primary text-primary-foreground shadow"
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => setOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:bg-secondary"
          >
            <SettingsIcon className="h-4 w-4" /> API Settings
          </button>
          <p className="mt-3 text-[10px] leading-tight text-muted-foreground">
            Vision 2030 · Vision 2035
          </p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" />
          </div>
          <span className="font-bold">HealthBridge</span>
        </Link>
        <button onClick={() => setOpen(true)} className="rounded-lg border border-border p-2">
          <SettingsIcon className="h-4 w-4" />
        </button>
      </div>
      <nav className="sticky top-[57px] z-20 flex gap-1 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden">
        {links.map((l) => {
          const active = path === l.to;
          const Icon = l.icon;
          return (
            <Link
              key={l.to}
              to={l.to}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5 text-xs ${
                active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {l.label}
            </Link>
          );
        })}
      </nav>

      <SettingsModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}