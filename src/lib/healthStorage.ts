export type Severity = "mild" | "moderate" | "severe";
export type Status = "Pending" | "In Review" | "Resolved";

export interface HealthReport {
  id: string;
  userName: string;
  location: string;
  symptoms: string;
  category: string;
  severity: Severity;
  status: Status;
  date: string;
}

const REPORTS_KEY = "hb_reports";
const SEEDED_KEY = "hb_seeded";
const API_KEY_KEY = "hb_openrouter_key";
const ROLE_KEY = "hb_role";

const SEED: HealthReport[] = [
  { id: "r1", userName: "Amara N.", location: "Nairobi, KE", symptoms: "High fever and chills for 3 days", category: "Fever", severity: "severe", status: "Pending", date: daysAgo(1) },
  { id: "r2", userName: "Joseph M.", location: "Kisumu, KE", symptoms: "Suspected dengue symptoms, rash and headache", category: "Dengue", severity: "severe", status: "In Review", date: daysAgo(2) },
  { id: "r3", userName: "Fatima A.", location: "Lagos, NG", symptoms: "Feeling persistently anxious and unable to sleep", category: "Mental Health", severity: "moderate", status: "Pending", date: daysAgo(3) },
  { id: "r4", userName: "Grace W.", location: "Kampala, UG", symptoms: "Pregnancy check-up needed, 28 weeks", category: "Maternal Care", severity: "mild", status: "Resolved", date: daysAgo(5) },
  { id: "r5", userName: "David K.", location: "Mombasa, KE", symptoms: "Question about child vaccination schedule", category: "Vaccination", severity: "mild", status: "Resolved", date: daysAgo(6) },
  { id: "r6", userName: "Linda O.", location: "Accra, GH", symptoms: "Persistent cough for two weeks", category: "Respiratory", severity: "moderate", status: "In Review", date: daysAgo(4) },
  { id: "r7", userName: "Samuel T.", location: "Dar es Salaam, TZ", symptoms: "Severe stomach pain and vomiting", category: "Gastro", severity: "severe", status: "Pending", date: daysAgo(1) },
  { id: "r8", userName: "Naomi P.", location: "Nairobi, KE", symptoms: "Mild headache and fatigue", category: "Fever", severity: "mild", status: "Resolved", date: daysAgo(8) },
  { id: "r9", userName: "Brian L.", location: "Eldoret, KE", symptoms: "Diabetes follow-up consultation", category: "Chronic", severity: "moderate", status: "In Review", date: daysAgo(7) },
  { id: "r10", userName: "Mary J.", location: "Nakuru, KE", symptoms: "Postnatal depression concerns", category: "Mental Health", severity: "moderate", status: "Pending", date: daysAgo(2) },
  { id: "r11", userName: "Peter A.", location: "Arusha, TZ", symptoms: "Malaria-like symptoms, fever and joint pain", category: "Malaria", severity: "severe", status: "In Review", date: daysAgo(3) },
  { id: "r12", userName: "Sarah B.", location: "Kigali, RW", symptoms: "Routine maternal check-up follow-up", category: "Maternal Care", severity: "mild", status: "Resolved", date: daysAgo(10) },
];

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export function ensureSeed() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem(SEEDED_KEY)) {
    localStorage.setItem(REPORTS_KEY, JSON.stringify(SEED));
    localStorage.setItem(SEEDED_KEY, "1");
  }
}

export function getReports(): HealthReport[] {
  if (typeof window === "undefined") return [];
  ensureSeed();
  try {
    return JSON.parse(localStorage.getItem(REPORTS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveReports(reports: HealthReport[]) {
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function addReport(r: Omit<HealthReport, "id" | "date" | "status">) {
  const reports = getReports();
  const newReport: HealthReport = {
    ...r,
    id: "r" + Date.now(),
    date: new Date().toISOString(),
    status: "Pending",
  };
  reports.unshift(newReport);
  saveReports(reports);
  return newReport;
}

export function updateStatus(id: string, status: Status) {
  const reports = getReports().map((r) => (r.id === id ? { ...r, status } : r));
  saveReports(reports);
}

export function getApiKey() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(API_KEY_KEY) || "";
}
export function setApiKey(k: string) {
  localStorage.setItem(API_KEY_KEY, k);
}

export function getRole(): string {
  if (typeof window === "undefined") return "user";
  return localStorage.getItem(ROLE_KEY) || "user";
}
export function setRole(r: string) {
  localStorage.setItem(ROLE_KEY, r);
}