import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Download, TrendingUp, Users, Clock, Sparkles, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { AppLayout } from "@/components/AppLayout";
import { ensureSeed, getReports, type HealthReport } from "@/lib/healthStorage";
import { callAI } from "@/lib/ai";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "Client Dashboard — HealthBridge AI" },
      { name: "description", content: "Impact metrics and insights for hospitals and NGOs." },
    ],
  }),
  component: () => (
    <AppLayout>
      <ClientPage />
    </AppLayout>
  ),
});

const COLORS = ["var(--color-chart-1)", "var(--color-chart-2)", "var(--color-chart-3)", "var(--color-chart-4)", "var(--color-chart-5)"];

function ClientPage() {
  const [reports, setReports] = useState<HealthReport[]>([]);
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ensureSeed();
    setReports(getReports());
  }, []);

  const metrics = useMemo(() => {
    const assisted = new Set(reports.map((r) => r.userName)).size;
    const resolved = reports.filter((r) => r.status === "Resolved").length;
    const avg = resolved > 0 ? (reports.length / resolved).toFixed(1) : "—";
    return { assisted, resolved, avg };
  }, [reports]);

  const pie = useMemo(() => {
    const map: Record<string, number> = {};
    reports.forEach((r) => (map[r.category] = (map[r.category] || 0) + 1));
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [reports]);

  function downloadCsv() {
    const headers = ["id", "userName", "location", "category", "symptoms", "severity", "status", "date"];
    const rows = reports.map((r) =>
      headers.map((h) => `"${String(r[h as keyof HealthReport]).replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "healthbridge_reports.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function genInsight() {
    setLoading(true);
    setError("");
    setInsight("");
    try {
      const summary = pie.map((p) => `${p.name}=${p.value}`).join(", ");
      const text = await callAI([
        {
          role: "user",
          content: `Identify the top 3 health risks this month for an NGO/hospital based on these category counts: ${summary}. Provide brief actionable recommendations.`,
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
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Client Dashboard</h1>
          <p className="text-sm text-muted-foreground">Impact view for hospitals, NGOs and government partners.</p>
        </div>
        <button
          onClick={downloadCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary"
        >
          <Download className="h-4 w-4" /> Download CSV
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Metric icon={Users} label="People Assisted" value={String(metrics.assisted)} />
        <Metric icon={TrendingUp} label="Issues Resolved" value={String(metrics.resolved)} />
        <Metric icon={Clock} label="Avg Response (days)" value={metrics.avg} />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-3">
          <h3 className="mb-4 font-semibold text-foreground">Health Issue Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pie} dataKey="value" nameKey="name" outerRadius={110} label>
                  {pie.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-primary" /> AI Insights
          </h3>
          <p className="mb-3 text-xs text-muted-foreground">Top health risks this month and recommendations.</p>
          <button
            onClick={genInsight}
            disabled={loading}
            className="mb-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate Insights
          </button>
          {error && <p className="text-xs text-destructive">{error}</p>}
          {insight && (
            <div className="whitespace-pre-wrap rounded-lg bg-secondary p-3 text-sm text-foreground">
              {insight}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}