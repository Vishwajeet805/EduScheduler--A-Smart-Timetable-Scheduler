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
import { ThemeToggle } from "@/components/theme-toggle";
import { useEduStore } from "@/state/store";
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
  Plus,
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

interface Subject {
  id: string;
  code: string;
  name: string;
  department: string;
  semester: string;
  faculty: string;
}

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];
const semesters = [
  "1st Semester",
  "2nd Semester",
  "3rd Semester",
  "4th Semester",
  "5th Semester",
  "6th Semester",
  "7th Semester",
  "8th Semester",
];

const initialSubjects: Subject[] = [
  {
    id: "1",
    code: "CS101",
    name: "Data Structures",
    department: "Computer Science",
    semester: "3rd Semester",
    faculty: "Dr. Smith",
  },
  {
    id: "2",
    code: "CS102",
    name: "Algorithms",
    department: "Computer Science",
    semester: "3rd Semester",
    faculty: "Prof. Johnson",
  },
  {
    id: "3",
    code: "EC201",
    name: "Digital Electronics",
    department: "Electronics",
    semester: "2nd Semester",
    faculty: "Dr. Mehta",
  },
  {
    id: "4",
    code: "ME305",
    name: "Thermodynamics",
    department: "Mechanical",
    semester: "5th Semester",
    faculty: "Dr. Chen",
  },
  {
    id: "5",
    code: "CE210",
    name: "Structural Analysis",
    department: "Civil",
    semester: "4th Semester",
    faculty: "Prof. Rao",
  },
  {
    id: "6",
    code: "EE150",
    name: "Circuit Theory",
    department: "Electrical",
    semester: "2nd Semester",
    faculty: "Dr. Patel",
  },
];

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

export default function ManageSubjects() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const {
    state,
    upsertSubject: upsertToStore,
    deleteSubject: deleteFromStore,
  } = useEduStore();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [semFilter, setSemFilter] = useState<string>("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Subject | null>(null);
  const [form, setForm] = useState<Subject>({
    id: "",
    code: "",
    name: "",
    department: "",
    semester: "",
    faculty: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 8;

  const subjects = state.subjects.map((s) => ({
    id: s.id || s.code,
    code: s.code,
    name: s.name,
    department: "",
    semester: s.semester,
    faculty:
      (s.linkedFacultyIds[0] &&
        state.faculties.find((f) => f.id === s.linkedFacultyIds[0])?.name) ||
      "",
  }));

  const filtered = useMemo(() => {
    return subjects.filter((s) => {
      const matchesSearch =
        s.code.toLowerCase().includes(search.toLowerCase()) ||
        s.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === "all" || s.department === deptFilter;
      const matchesSem = semFilter === "all" || s.semester === semFilter;
      return matchesSearch && matchesDept && matchesSem;
    });
  }, [subjects, search, deptFilter, semFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const openAdd = () => {
    setEditing(null);
    setForm({
      id: "",
      code: "",
      name: "",
      department: "",
      semester: "",
      faculty: "",
    });
    setIsDialogOpen(true);
  };

  const openEdit = (subject: Subject) => {
    setEditing(subject);
    setForm(subject);
    setIsDialogOpen(true);
  };

  const saveSubject = () => {
    if (!form.code.trim() || !form.name.trim() || !form.semester) {
      toast.error("Please fill in all required fields");
      return;
    }

    const linkedId = state.faculties.find(
      (f) => f.name.toLowerCase() === form.faculty.toLowerCase(),
    )?.id;
    upsertToStore({
      id: form.id || form.code,
      code: form.code,
      name: form.name,
      semester: form.semester,
      type: "theory",
      weeklyHours: 3,
      linkedFacultyIds: linkedId ? [linkedId] : [],
    } as any);
    toast.success(
      editing ? "Subject updated successfully" : "Subject added successfully",
    );
    setIsDialogOpen(false);
    setEditing(null);
  };

  const deleteSubjectLocal = (id: string) => {
    deleteFromStore(id);
    toast.success("Subject deleted");
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
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
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
                      className={`
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-[1.02]
                        ${isActive ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-sm"}
                      `}
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
                  <BookOpen className="h-5 w-5 text-primary" />
                  Manage Subjects
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage academic subjects across semesters and
                  departments.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by code or name..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="pl-10"
                  />
                </div>

                <Select
                  value={deptFilter}
                  onValueChange={(v) => {
                    setDeptFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-56">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={semFilter}
                  onValueChange={(v) => {
                    setSemFilter(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Semesters</SelectItem>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button onClick={openAdd} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Subject
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Subjects ({filtered.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Code</TableHead>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Assigned Faculty</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((s) => (
                    <TableRow key={s.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{s.code}</TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.department}</TableCell>
                      <TableCell>{s.semester}</TableCell>
                      <TableCell>{s.faculty}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEdit(s)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={() => deleteSubjectLocal(s.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {paginated.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No subjects found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {page} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="hidden sm:flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .slice(Math.max(0, page - 3), Math.max(0, page - 3) + 5)
                      .map((p) => (
                        <Button
                          key={p}
                          variant={p === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </Button>
                      ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {editing ? "Edit Subject" : "Add New Subject"}
            </DialogTitle>
            <DialogDescription>
              Provide subject details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Subject Code *</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                placeholder="e.g., CS101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Data Structures"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select
                  value={form.department}
                  onValueChange={(v) => setForm({ ...form, department: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Semester *</Label>
                <Select
                  value={form.semester}
                  onValueChange={(v) => setForm({ ...form, semester: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="faculty">Assigned Faculty</Label>
              <Input
                id="faculty"
                value={form.faculty}
                onChange={(e) => setForm({ ...form, faculty: e.target.value })}
                placeholder="e.g., Dr. Smith"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveSubject}>
              {editing ? "Update Subject" : "Add Subject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
