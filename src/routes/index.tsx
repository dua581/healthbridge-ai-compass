import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Heart, Activity, Shield, Users, ArrowRight, Stethoscope } from "lucide-react";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HealthBridge AI — Community Health Powered by AI" },
      { name: "description", content: "AI-powered public health guidance aligned with SDG 3, Vision 2030 & Vision 2035." },
      { property: "og:title", content: "HealthBridge AI" },
      { property: "og:description", content: "AI-powered public health guidance aligned with SDG 3." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Heart className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-foreground">HealthBridge AI</div>
            <div className="text-xs text-muted-foreground">SDG 3 · Good Health</div>
          </div>
        </div>
        <Link
          to="/user"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Launch App
        </Link>
      </header>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center md:px-12">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Activity className="h-3.5 w-3.5" /> UN SDG 3 · Good Health & Well-being
        </span>
        <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-foreground md:text-6xl">
          Bridging communities to <span className="text-primary">AI-powered health</span> guidance
        </h1>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
          Aligned with <strong className="text-foreground">Vision 2030</strong> and{" "}
          <strong className="text-foreground">Vision 2035</strong>, HealthBridge AI helps people access guidance,
          report concerns, and helps organizations track public health trends in real time.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/user"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:opacity-90"
          >
            Enter Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/admin"
            className="rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-secondary"
          >
            Admin View
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {[
            { icon: Stethoscope, title: "AI Triage", desc: "Describe symptoms, get guidance" },
            { icon: Shield, title: "Report Concerns", desc: "Surface local outbreaks fast" },
            { icon: Users, title: "Impact Insights", desc: "Track community health trends" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-5 text-left">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-semibold text-foreground">{title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
