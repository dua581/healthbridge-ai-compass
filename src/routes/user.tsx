import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, MapPin, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { AppLayout } from "@/components/AppLayout";
import { HealthChat } from "@/components/HealthChat";
import {
  addReport,
  ensureSeed,
  getReports,
  type HealthReport,
  type Severity,
} from "@/lib/healthStorage";

export const Route = createFileRoute("/user")({
  head: () => ({
    meta: [
      { title: "User Dashboard — HealthBridge AI" },
      { name: "description", content: "Chat with the AI assistant and submit health concerns." },
    ],
  }),
  component: UserPage,
});

const TIPS = [
  "Stay hydrated — aim for 6–8 glasses of water daily.",
  "Sleep 7–9 hours to support immunity and mental health.",
  "Wash hands with soap for at least 20 seconds.",
  "Eat 5 servings of fruits & vegetables every day.",
  "Take 30 minutes of movement daily — walking counts.",
  "Mental health matters: talk to someone when overwhelmed.",
];

function UserPage() {
  return (
    <AppLayout>
      <UserContent />
    </AppLayout>
  );
}

function UserContent() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [userName] = useState("You");
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    ensureSeed();
    setReports(getReports().filter((r) => r.userName === "You"));
    const id = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Your personal health companion.</p>
      </div>

      {/* Tips carousel */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/40 p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Heart className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">Wellness Tip</div>
            <div className="mt-1 text-sm font-medium text-foreground">{TIPS[tipIdx]}</div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setTipIdx((i) => (i - 1 + TIPS.length) % TIPS.length)}
              className="rounded-md border border-border bg-card p-1"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTipIdx((i) => (i + 1) % TIPS.length)}
              className="rounded-md border border-border bg-card p-1"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <HealthChat />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <ReportForm
            userName={userName}
            onSubmit={(r) => {
              addReport(r);
              setReports(getReports().filter((x) => x.userName === "You"));
            }}
          />
          <PastReports reports={reports} />
        </div>
      </div>
    </div>
  );
}

function ReportForm({
  userName,
  onSubmit,
}: {
  userName: string;
  onSubmit: (r: { userName: string; location: string; symptoms: string; category: string; severity: Severity }) => void;
}) {
  const [location, setLocation] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [category, setCategory] = useState("Fever");
  const [severity, setSeverity] = useState<Severity>("mild");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
        <Activity className="h-4 w-4 text-primary" /> Report a Health Concern
      </h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!location || !symptoms) return;
          onSubmit({ userName, location, symptoms, category, severity });
          setLocation("");
          setSymptoms("");
          setSubmitted(true);
          setTimeout(() => setSubmitted(false), 2500);
        }}
        className="space-y-3"
      >
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Your location (city, country)"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe symptoms..."
          rows={3}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {["Fever","Respiratory","Mental Health","Maternal Care","Vaccination","Dengue","Malaria","Gastro","Chronic","Other"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as Severity)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="mild">Mild</option>
            <option value="moderate">Moderate</option>
            <option value="severe">Severe</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
        >
          Submit Report
        </button>
        {submitted && (
          <p className="text-center text-xs font-medium text-primary">Report submitted. Thank you!</p>
        )}
      </form>
    </div>
  );
}

function PastReports({ reports }: { reports: HealthReport[] }) {
  const items = useMemo(() => reports.slice(0, 5), [reports]);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h3 className="mb-4 font-semibold text-foreground">Your Past Reports</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reports yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((r) => (
            <li key={r.id} className="rounded-lg border border-border p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {r.location}
                </span>
                <span className={severityClass(r.severity)}>{r.severity}</span>
              </div>
              <div className="mt-1 text-sm text-foreground">{r.symptoms}</div>
              <div className="mt-1 text-xs text-primary">{r.status}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function severityClass(s: Severity) {
  const base = "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase";
  if (s === "severe") return `${base} bg-destructive/15 text-destructive`;
  if (s === "moderate") return `${base} bg-chart-3/15 text-chart-3`;
  return `${base} bg-primary/15 text-primary`;
}