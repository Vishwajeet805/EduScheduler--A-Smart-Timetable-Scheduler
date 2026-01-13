import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/hooks/use-theme";
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
  Settings as SettingsIcon,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";

interface Admin {
  id: string;
  name: string;
  role: string;
  email: string;
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
  { icon: SettingsIcon, label: "Settings", path: "/settings" },
];

const initialAdmins: Admin[] = [
  {
    id: "1",
    name: "Vishwajeet Singh",
    role: "Super Admin",
    email: "vishwajeet@university.edu",
  },
  {
    id: "2",
    name: "Sarah Smith",
    role: "Admin",
    email: "sarah@university.edu",
  },
];

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  // Profile Settings state
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@university.edu");
  const [password, setPassword] = useState("");

  // System Preferences state
  const [darkMode, setDarkMode] = useState(theme === "dark");
  const [language, setLanguage] = useState("English");

  // Notification Settings state
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [systemNotifications, setSystemNotifications] = useState(true);

  // Access Control state
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [isAdminDialogOpen, setIsAdminDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [adminForm, setAdminForm] = useState<Admin>({
    id: "",
    name: "",
    role: "Admin",
    email: "",
  });

  const openAddAdmin = () => {
    setEditingAdmin(null);
    setAdminForm({ id: "", name: "", role: "Admin", email: "" });
    setIsAdminDialogOpen(true);
  };

  const openEditAdmin = (admin: Admin) => {
    setEditingAdmin(admin);
    setAdminForm(admin);
    setIsAdminDialogOpen(true);
  };

  const saveAdmin = () => {
    if (!adminForm.name.trim() || !adminForm.email.trim()) return;
    if (editingAdmin) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editingAdmin.id ? { ...adminForm, id: editingAdmin.id } : a,
        ),
      );
    } else {
      setAdmins((prev) => [{ ...adminForm, id: String(Date.now()) }, ...prev]);
    }
    setIsAdminDialogOpen(false);
    setEditingAdmin(null);
  };

  const removeAdmin = (id: string) => {
    setAdmins((prev) => prev.filter((a) => a.id !== id));
  };

  const saveProfile = () => {
    // persist later
  };

  const saveSystem = () => {
    setTheme(darkMode ? "dark" : "light");
  };

  const saveNotifications = () => {
    // persist later
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
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  Settings & Preferences
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Accordion type="multiple" className="space-y-4">
            <AccordionItem value="profile">
              <Card className="border-0 shadow-sm">
                <AccordionTrigger className="px-6 py-4">
                  <div className="text-left">
                    <div className="text-base font-semibold">
                      Profile Settings
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Update your personal information and password.
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-2 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 max-w-md">
                      <Label htmlFor="password">Password Reset</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Button className="gap-2">Save</Button>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="system">
              <Card className="border-0 shadow-sm">
                <AccordionTrigger className="px-6 py-4">
                  <div className="text-left">
                    <div className="text-base font-semibold">
                      System Preferences
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Theme and language preferences.
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-2 space-y-4">
                    <div className="flex items-center justify-between max-w-md">
                      <div>
                        <div className="font-medium">Dark Mode</div>
                        <div className="text-sm text-muted-foreground">
                          Toggle between light and dark theme.
                        </div>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={(v) => setDarkMode(v)}
                      />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <Label>Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Hindi">Hindi</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Button className="gap-2" onClick={saveSystem}>
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="notifications">
              <Card className="border-0 shadow-sm">
                <AccordionTrigger className="px-6 py-4">
                  <div className="text-left">
                    <div className="text-base font-semibold">
                      Notification Settings
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Choose how you want to be notified.
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-2 space-y-4">
                    <div className="flex items-center justify-between max-w-md">
                      <div>
                        <div className="font-medium">Email Alerts</div>
                        <div className="text-sm text-muted-foreground">
                          Receive important updates via email.
                        </div>
                      </div>
                      <Switch
                        checked={emailAlerts}
                        onCheckedChange={setEmailAlerts}
                      />
                    </div>
                    <div className="flex items-center justify-between max-w-md">
                      <div>
                        <div className="font-medium">System Notifications</div>
                        <div className="text-sm text-muted-foreground">
                          Show in-app alerts and updates.
                        </div>
                      </div>
                      <Switch
                        checked={systemNotifications}
                        onCheckedChange={setSystemNotifications}
                      />
                    </div>
                    <div>
                      <Button className="gap-2" onClick={saveNotifications}>
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>

            <AccordionItem value="access">
              <Card className="border-0 shadow-sm">
                <AccordionTrigger className="px-6 py-4">
                  <div className="text-left">
                    <div className="text-base font-semibold">
                      Access Control
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Manage administrators and roles.
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Admins with access to EduScheduler
                      </div>
                      <Button className="gap-2" onClick={openAddAdmin}>
                        <UserPlus className="h-4 w-4" />
                        Add New Admin
                      </Button>
                    </div>
                    <Card className="border-0 shadow-sm">
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Name</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead className="text-right">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {admins.map((a) => (
                              <TableRow
                                key={a.id}
                                className="hover:bg-muted/50"
                              >
                                <TableCell className="font-medium">
                                  {a.name}
                                </TableCell>
                                <TableCell>{a.role}</TableCell>
                                <TableCell>{a.email}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center gap-2 justify-end">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => openEditAdmin(a)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                      onClick={() => removeAdmin(a.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                            {admins.length === 0 && (
                              <TableRow>
                                <TableCell
                                  colSpan={4}
                                  className="text-center text-muted-foreground py-8"
                                >
                                  No admins found.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          </Accordion>
        </div>
      </main>

      <Dialog open={isAdminDialogOpen} onOpenChange={setIsAdminDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingAdmin ? "Edit Admin" : "Add New Admin"}
            </DialogTitle>
            <DialogDescription>Set the admin details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-name">Name</Label>
              <Input
                id="admin-name"
                value={adminForm.name}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={adminForm.email}
                onChange={(e) =>
                  setAdminForm({ ...adminForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={adminForm.role}
                onValueChange={(v) => setAdminForm({ ...adminForm, role: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Editor">Editor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAdminDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveAdmin}>
              {editingAdmin ? "Update Admin" : "Add Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
