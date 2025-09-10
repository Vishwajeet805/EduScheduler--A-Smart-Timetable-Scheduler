import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Calendar,
  Users,
  School,
  ClipboardList,
  Menu,
  X,
  GraduationCap,
  LogOut,
  Home,
  BookOpen,
  Clock,
  BarChart3,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  UserPlus,
  MapPin,
  Zap,
  Activity,
  Database,
  Bell,
  Settings,
  Sparkles,
  Building,
  Layers
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Create Timetable", path: "/create-timetable" },
  { icon: Users, label: "Manage Faculty", path: "/manage-faculty" },
  { icon: Building, label: "Manage Classrooms", path: "/manage-classrooms" },
  { icon: BookOpen, label: "Manage Subjects", path: "/manage-subjects" },
  { icon: Layers, label: "Manage Batches", path: "/manage-batches" },
  { icon: ClipboardList, label: "Review Timetables", path: "/review-timetables" },
  { icon: BarChart3, label: "Reports & Analytics", path: "/reports" },
  { icon: Bell, label: "Notifications", path: "/notifications" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const stats = [
    { title: "Total Classrooms", value: "24", icon: Building, color: "text-blue-600", bgColor: "bg-blue-50", pulse: false },
    { title: "Total Faculty", value: "48", icon: Users, color: "text-green-600", bgColor: "bg-green-50", pulse: false },
    { title: "Pending Timetables", value: "3", icon: AlertCircle, color: "text-orange-600", bgColor: "bg-orange-50", pulse: true },
    { title: "Active Schedules", value: "12", icon: Activity, color: "text-purple-600", bgColor: "bg-purple-50", pulse: false },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-primary rounded-lg">
                <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-sidebar-foreground">EduScheduler</span>
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

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {sidebarItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]
                        ${isActive
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-sm'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-sm'
                        }
                      `}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className={`h-4 w-4 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'scale-110' : ''}`} />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
              onClick={() => window.location.href = '/'}
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64">
        {/* Top bar */}
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
                <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, Admin</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <div className="p-6">
          {/* Welcome section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to EduScheduler</h2>
            <p className="text-muted-foreground">
              Manage your smart classroom and timetable scheduling efficiently.
            </p>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="group border-0 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-full ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                    <stat.icon className={`h-4 w-4 ${stat.color} ${stat.pulse ? 'animate-pulse' : ''} transition-transform duration-300 group-hover:scale-110`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">{stat.value}</div>
                  {stat.pulse && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></div>
                      <span className="text-xs text-orange-600 font-medium">Needs attention</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-5 w-5 text-primary animate-pulse" />
                  </div>
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/create-timetable">
                  <Button className="group w-full justify-start hover:scale-[1.02] transition-all duration-200" variant="outline">
                    <Calendar className="h-4 w-4 mr-2 group-hover:animate-pulse" />
                    Create New Timetable
                  </Button>
                </Link>
                <Link to="/manage-faculty">
                  <Button className="group w-full justify-start hover:scale-[1.02] transition-all duration-200" variant="outline">
                    <UserPlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Add Faculty Member
                  </Button>
                </Link>
                <Link to="/manage-classrooms">
                  <Button className="group w-full justify-start hover:scale-[1.02] transition-all duration-200" variant="outline">
                    <Building className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    Add Classroom
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Clock className="h-5 w-5 text-green-600" />
                  </div>
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="group flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">CS Department timetable created</span>
                    </div>
                    <span className="text-xs text-muted-foreground">2h ago</span>
                  </div>
                  <Separator />
                  <div className="group flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">Room A-101 added</span>
                    </div>
                    <span className="text-xs text-muted-foreground">4h ago</span>
                  </div>
                  <Separator />
                  <div className="group flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-muted-foreground group-hover:text-foreground transition-colors">Dr. Smith schedule updated</span>
                    </div>
                    <span className="text-xs text-muted-foreground">1d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                  </div>
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="group flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Database</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                      Healthy
                    </span>
                  </div>
                  <div className="group flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-green-600 animate-spin" style={{animationDuration: '3s'}} />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Scheduler</span>
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
                      Active
                    </span>
                  </div>
                  <div className="group flex justify-between items-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600 animate-bounce" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Notifications</span>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      3 Pending
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
