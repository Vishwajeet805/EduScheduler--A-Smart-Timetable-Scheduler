import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

type Category = "all" | "faculty" | "classrooms" | "system";
type NType = "info" | "warning" | "success" | "error";

interface NotificationItem {
  id: string;
  type: NType;
  title: string;
  description: string;
  timestamp: string; // relative like "2h ago" for demo
  category: Exclude<Category, "all">;
  read: boolean;
}

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

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    type: "success",
    title: "New Faculty Added",
    description: "Dr. John was added to the CSE Department.",
    timestamp: "2h ago",
    category: "faculty",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Classroom Under Maintenance",
    description: "Room D-105 marked under maintenance for 48 hours.",
    timestamp: "4h ago",
    category: "classrooms",
    read: false,
  },
  {
    id: "n3",
    type: "info",
    title: "System Update Scheduled",
    description: "Performance updates will be applied tonight at 11:30 PM.",
    timestamp: "6h ago",
    category: "system",
    read: true,
  },
  {
    id: "n4",
    type: "error",
    title: "Timetable Conflict Detected",
    description: "Overlap found for CS-A on Tuesday 2-3 PM.",
    timestamp: "1d ago",
    category: "system",
    read: false,
  },
  {
    id: "n5",
    type: "info",
    title: "Classroom Added",
    description: "New room C-301 added to Academic Block C.",
    timestamp: "2d ago",
    category: "classrooms",
    read: true,
  },
];

export default function Notifications() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [tab, setTab] = useState<Category>("all");

  const filtered = useMemo(() => {
    if (tab === "all") return notifications;
    return notifications.filter((n) => n.category === tab);
  }, [notifications, tab]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const iconForType = (type: NType) => {
    switch (type) {
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error":
      default:
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
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
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </h1>
                <p className="text-sm text-muted-foreground">
                  View alerts and system updates.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={markAllAsRead}>
                Mark All as Read
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Tabs value={tab} onValueChange={(v) => setTab(v as Category)}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="faculty">Faculty</TabsTrigger>
                <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value={tab}>
              <div className="space-y-3">
                {filtered.map((n) => (
                  <Card
                    key={n.id}
                    className={`border-0 shadow-sm hover:shadow-md transition-all duration-200 group relative overflow-hidden`}
                  >
                    {!n.read && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-blue-500" />
                    )}
                    <CardContent className="py-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted/50 group-hover:scale-110 transition-transform">
                          {iconForType(n.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="font-medium text-foreground">
                              {n.title}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {n.timestamp}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {n.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filtered.length === 0 && (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="py-10 text-center text-muted-foreground">
                      No notifications to display.
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
