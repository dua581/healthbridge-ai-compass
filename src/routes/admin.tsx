import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, Users, Sparkles, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AppLayout } from "@/components/AppLayout";
import {
  ensureSeed,
  getReports,
  updateStatus,
  type HealthReport,
  type Status,
} from "@/lib/healthStorage";
import { callAI } from "@/lib/ai";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — HealthBridge AI" },
      { name: "description", content: "Manage reports and review public health trends." },
    ],
  }),
  component: () => (
    <AppLayout>
      <AdminPage />
    </AppLayout>
  ),
});

function AdminPage() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ensureSeed();
    setReports(getReports());
  }, []);

  const stats = useMemo(() => {
    const total = reports.length;
    const critical = reports.filter((r) => r.severity === "severe").length;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const users = new Set(reports.map((r) => r.userName)).size;
    return { total, critical, resolved, users };
  }, [reports]);

  const chartData = useMemo(() => {
    const map: Record<string, number> = {};
    reports.forEach((r) => (map[r.category] = (map[r.category] || 0) + 1));
    return Object.entries(map).map(([category, count]) => ({ category, count }));
  }, [reports]);

  function advance(r: HealthReport) {
    const next: Status = r.status === "Pending" ? "In Review" : r.status === "In Review" ? "Resolved" : "Pending";
    updateStatus(r.id, next);
    setReports(getReports());
  }

  async function genSummary() {
    setLoading(true);
    setError("");
    setInsight("");
    try {
      const summary = `Total ${stats.total} reports; ${stats.critical} severe; categories: ${chartData
        .map((c) => `${c.category}=${c.count}`)
        .join(", ")}.`;
      const text = await callAI([
        {
          role: "user",
          content: `Summarize these current public health trends in 4-5 sentences for an admin dashboard. Highlight risks and recommended actions:\n${summary}`,
        },
      ]);
      setInsight(text);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Monitor and triage community health reports.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Activity} label="Total Reports" value={stats.total} tone="primary" />
        <StatCard icon={AlertTriangle} label="Critical Cases" value={stats.critical} tone="destructive" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats.resolved} tone="primary" />
        <StatCard icon={Users} label="Active Users" value={stats.users} tone="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-3">
          <h3 className="mb-4 font-semibold text-foreground">Reports by Category</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> AI Trend Summary
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Generate a quick AI summary of current public health trends.
          </p>
          <button
            onClick={genSummary}
            disabled={loading}
            className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Summary
          </button>
          {error && <p className="text-xs text-destructive">{error}</p>}
          {insight && (
            <div className="whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm text-foreground">
              {insight}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-foreground">All Reports</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">Location</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Severity</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-2 pr-4 font-medium">{r.userName}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{r.location}</td>
                  <td className="py-2 pr-4">{r.category}</td>
                  <td className="py-2 pr-4">
                    <span
                      className={
                        r.severity === "severe"
                          ? "rounded-full bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-destructive"
                          : r.severity === "moderate"
                          ? "rounded-full bg-chart-3/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-chart-3"
                          : "rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-primary"
                      }
                    >
                      {r.severity}
                    </span>
                  </td>
                  <td className="py-2 pr-4 text-xs font-medium">{r.status}</td>
                  <td className="py-2">
                    <button
                      onClick={() => advance(r)}
                      className="rounded-md border border-border px-2 py-1 text-xs hover:bg-secondary"
                    >
                      Advance →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "primary" | "destructive";
}) {
  const accent = tone === "destructive" ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${accent}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}