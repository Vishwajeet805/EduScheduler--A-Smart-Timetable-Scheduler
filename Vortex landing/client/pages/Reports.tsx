import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";
import {
  Menu,
  X,
  GraduationCap,
  LogOut,
  Home,
  Calendar,
  Users,
  Building,
  ClipboardList,
  Layers,
  BookOpen,
  BarChart3,
  Bell,
  Settings,
  Download,
  FileDown,
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Create Timetable", path: "/create-timetable" },
  { icon: Users, label: "Manage Faculty", path: "/manage-faculty" },
  { icon: Building, label: "Manage Classrooms", path: "/manage-classrooms" },
  { icon: BookOpen, label: "Manage Subjects", path: "/manage-subjects" },
  { icon: Layers, label: "Manage Batches", path: "/manage-batches" },
  {
    icon: ClipboardList,
    label: "Review Timetables",
    path: "/review-timetables",
  },
  { icon: BarChart3, label: "Reports & Analytics", path: "/reports" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

const workloadPie = [
  { name: "Balanced", value: 80 },
  { name: "Underloaded", value: 10 },
  { name: "Overloaded", value: 10 },
];

const utilizationBar = [
  { day: "Mon", utilization: 72 },
  { day: "Tue", utilization: 78 },
  { day: "Wed", utilization: 75 },
  { day: "Thu", utilization: 70 },
  { day: "Fri", utilization: 80 },
  { day: "Sat", utilization: 60 },
];

const attendanceLine = [
  { week: "W1", attendance: 92 },
  { week: "W2", attendance: 90 },
  { week: "W3", attendance: 88 },
  { week: "W4", attendance: 91 },
  { week: "W5", attendance: 89 },
  { week: "W6", attendance: 93 },
  { week: "W7", attendance: 95 },
  { week: "W8", attendance: 94 },
];

const chartConfig = {
  balanced: { label: "Balanced", color: "hsl(var(--primary))" },
  under: { label: "Underloaded", color: "#F59E0B" },
  over: { label: "Overloaded", color: "#EF4444" },
  utilization: { label: "Utilization", color: "hsl(var(--primary))" },
  attendance: { label: "Attendance", color: "#22C55E" },
};

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const facultyLoadText = "80% Balanced";
  const classroomUtilizationText = "75%";
  const totalTimetables = 45;

  const exportExcel = () => {
    const headers = ["Metric", "Value"];
    const rows = [
      ["Faculty Load (Balanced)", facultyLoadText],
      ["Classroom Utilization", classroomUtilizationText],
      ["Total Timetables Generated", String(totalTimetables)],
    ];
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((x) => `"${(x ?? "").toString().replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reports-summary.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<!doctype html><html><head><title>Reports</title><style>body{font-family:ui-sans-serif,system-ui; padding:24px} .card{border:1px solid #ddd; border-radius:8px; padding:12px; margin-bottom:12px}</style></head><body><h2>Reports & Analytics</h2><div class="card"><strong>Faculty Load:</strong> ${facultyLoadText}</div><div class="card"><strong>Classroom Utilization:</strong> ${classroomUtilizationText}</div><div class="card"><strong>Total Timetables Generated:</strong> ${totalTimetables}</div><p>Chart visuals are not included in this export. Use in-app view for interactive charts.</p></body></html>`,
    );
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="min-h-screen bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">
                EduScheduler
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02] ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-sm"}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon
                        className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? "scale-110" : ""}`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-sidebar-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={() => (window.location.href = "/")}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <main className="lg:ml-64">
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Reports & Analytics
                </h1>
                <p className="text-sm text-muted-foreground">
                  Visualize efficiency of timetables, workload, and utilization.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={exportPdf}>
                <FileDown className="h-4 w-4" /> Export as PDF
              </Button>
              <Button variant="outline" className="gap-2" onClick={exportExcel}>
                <Download className="h-4 w-4" /> Export as Excel
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Faculty Load
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">
                  80%{" "}
                  <span className="text-sm font-medium text-muted-foreground">
                    Balanced
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Classroom Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">75%</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                  Total Timetables Generated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">45</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">
                  Faculty Workload Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    balanced: {
                      label: "Balanced",
                      color: "hsl(var(--primary))",
                    },
                    under: { label: "Underloaded", color: "#F59E0B" },
                    over: { label: "Overloaded", color: "#EF4444" },
                  }}
                  className="h-72"
                >
                  <PieChart>
                    <Pie
                      data={workloadPie}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={2}
                    >
                      {workloadPie.map((entry) => {
                        const key =
                          entry.name === "Balanced"
                            ? "balanced"
                            : entry.name === "Underloaded"
                              ? "under"
                              : "over";
                        return (
                          <Cell key={entry.name} fill={`var(--color-${key})`} />
                        );
                      })}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-sm">
                  Classroom Utilization by Weekdays
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    utilization: {
                      label: "Utilization",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-72"
                >
                  <BarChart data={utilizationBar}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                    />
                    <XAxis
                      dataKey="day"
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis unit="%" stroke="hsl(var(--muted-foreground))" />
                    <Bar
                      dataKey="utilization"
                      fill="var(--color-utilization)"
                      radius={[6, 6, 0, 0]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm">
                Student Attendance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  attendance: { label: "Attendance", color: "#22C55E" },
                }}
                className="h-72"
              >
                <LineChart data={attendanceLine}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                  <YAxis unit="%" stroke="hsl(var(--muted-foreground))" />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="var(--color-attendance)"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
