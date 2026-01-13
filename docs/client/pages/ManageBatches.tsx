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
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
  Download,
  Printer,
  Users as UsersIcon,
} from "lucide-react";

interface SubjectDef {
  code: string;
  name: string;
  weeklyHours: number;
}

interface Batch {
  id: string; // Batch ID e.g., CS-A-2024
  year: string; // e.g., 2024
  department: string; // e.g., Computer Science
  semester: string; // e.g., 3rd Semester
  subjects: string[]; // list of subject codes
  facultyBySubject: Record<string, string>; // subjectCode -> faculty name
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

// subjects derived from centralized store

// faculty list derived from centralized store

// initial batches from centralized store

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

export default function ManageBatches() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const {
    state,
    upsertBatch: upsertToStore,
    deleteBatch: deleteFromStore,
  } = useEduStore();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [semFilter, setSemFilter] = useState<string>("all");

  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [batchForm, setBatchForm] = useState<Batch>({
    id: "",
    year: "",
    department: "",
    semester: "",
    subjects: [],
    facultyBySubject: {},
  });

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [assignBatch, setAssignBatch] = useState<Batch | null>(null);

  const availableSubjects: SubjectDef[] = state.subjects.map((s) => ({
    code: s.code,
    name: s.name,
    weeklyHours: s.weeklyHours ?? 3,
  }));
  const facultyList: string[] = state.faculties.map((f) => f.name);

  const totalWeeklyClasses = (batch: Batch) => {
    return batch.subjects.reduce((acc, code) => {
      const s = availableSubjects.find((x) => x.code === code);
      return acc + (s?.weeklyHours || 0);
    }, 0);
  };

  const batches: Batch[] = state.batches.map((b) => ({
    id: b.id,
    year: b.year,
    department: b.department,
    semester: b.semester,
    subjects: b.subjects,
    facultyBySubject: { ...b.facultyAssignments },
  }));

  const filtered = useMemo(() => {
    return batches.filter((b) => {
      const matchesSearch =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.department.toLowerCase().includes(search.toLowerCase());
      const matchesDept = deptFilter === "all" || b.department === deptFilter;
      const matchesSem = semFilter === "all" || b.semester === semFilter;
      return matchesSearch && matchesDept && matchesSem;
    });
  }, [batches, search, deptFilter, semFilter]);

  const openAddBatch = () => {
    setEditingBatch(null);
    setBatchForm({
      id: "",
      year: "",
      department: "",
      semester: "",
      subjects: [],
      facultyBySubject: {},
    });
    setIsBatchDialogOpen(true);
  };

  const openEditBatch = (batch: Batch) => {
    setEditingBatch(batch);
    setBatchForm(batch);
    setIsBatchDialogOpen(true);
  };

  const saveBatch = () => {
    if (
      !batchForm.id.trim() ||
      !batchForm.year.trim() ||
      !batchForm.department ||
      !batchForm.semester
    )
      return;
    const normalized: Batch = {
      ...batchForm,
      subjects: [...new Set(batchForm.subjects)],
    };
    upsertToStore({
      id: normalized.id,
      year: normalized.year,
      department: normalized.department,
      semester: normalized.semester,
      subjects: normalized.subjects,
      facultyAssignments: { ...normalized.facultyBySubject },
    } as any);
    setIsBatchDialogOpen(false);
    setEditingBatch(null);
  };

  const removeBatch = (id: string) => {
    deleteFromStore(id);
  };

  const openAssignFaculty = (batch: Batch) => {
    setAssignBatch(batch);
    setIsAssignDialogOpen(true);
  };

  const setFacultyFor = (subjectCode: string, faculty: string) => {
    if (!assignBatch) return;
    const next: Batch = {
      ...assignBatch,
      facultyBySubject: {
        ...assignBatch.facultyBySubject,
        [subjectCode]: faculty,
      },
    };
    setAssignBatch(next);
  };

  const saveAssignments = () => {
    if (!assignBatch) return;
    upsertToStore({
      id: assignBatch.id,
      year: assignBatch.year,
      department: assignBatch.department,
      semester: assignBatch.semester,
      subjects: assignBatch.subjects,
      facultyAssignments: { ...assignBatch.facultyBySubject },
    } as any);
    setIsAssignDialogOpen(false);
    setAssignBatch(null);
  };

  const exportCsv = () => {
    const headers = [
      "Batch Name",
      "Year",
      "Department",
      "Semester",
      "Subjects Assigned",
      "Faculty Assigned",
      "Total Weekly Classes",
    ];
    const rows = filtered.map((b) => {
      const subjNames = b.subjects
        .map((code) => {
          const def = availableSubjects.find((s) => s.code === code);
          return def ? `${def.code}-${def.name}` : code;
        })
        .join(" | ");
      const faculty = b.subjects
        .map((code) => `${code}:${b.facultyBySubject[code] || "-"}`)
        .join(" | ");
      return [
        b.id,
        b.year,
        b.department,
        b.semester,
        subjNames,
        faculty,
        String(totalWeeklyClasses(b)),
      ];
    });
    const csv = [headers, ...rows]
      .map((r) =>
        r.map((x) => `"${(x ?? "").toString().replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batches.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const printPdf = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const tableRows = filtered
      .map((b) => {
        const subjects = b.subjects
          .map(
            (code) =>
              availableSubjects.find((s) => s.code === code)?.name || code,
          )
          .join(", ");
        const faculty = b.subjects
          .map((code) => `${code}: ${b.facultyBySubject[code] || "-"}`)
          .join(", ");
        return `<tr><td>${b.id}</td><td>${b.semester}</td><td>${subjects}</td><td>${faculty}</td><td>${totalWeeklyClasses(b)}</td></tr>`;
      })
      .join("");
    win.document.write(
      `<!doctype html><html><head><title>Batches</title><style>body{font-family:ui-sans-serif,system-ui; padding:24px} table{width:100%; border-collapse:collapse} th,td{border:1px solid #ddd; padding:8px; font-size:12px} th{background:#f5f5f5}</style></head><body><h2>Batches Summary</h2><table><thead><tr><th>Batch Name</th><th>Semester</th><th>Subjects Assigned</th><th>Faculty Assigned</th><th>Total Weekly Classes</th></tr></thead><tbody>${tableRows}</tbody></table></body></html>`,
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
                  <Layers className="h-5 w-5 text-primary" />
                  Manage Batches
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create, edit, and manage student batches with subjects and
                  faculty assignments.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2" onClick={exportCsv}>
                <Download className="h-4 w-4" /> Export CSV
              </Button>
              <Button variant="outline" className="gap-2" onClick={printPdf}>
                <Printer className="h-4 w-4" /> Export PDF
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <div className="p-6">
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="relative w-full md:flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by batch ID or department..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={deptFilter} onValueChange={setDeptFilter}>
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
                <Select value={semFilter} onValueChange={setSemFilter}>
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
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {filtered.map((b) => (
              <Card
                key={b.id}
                className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UsersIcon className="h-5 w-5 text-primary" />
                      {b.id}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {b.semester}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Department</span>
                      <span>{b.department}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Year</span>
                      <span>{b.year}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Total Weekly Classes
                      </span>
                      <span className="font-medium">
                        {totalWeeklyClasses(b)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {b.subjects.slice(0, 3).map((code) => {
                      const s = availableSubjects.find((x) => x.code === code);
                      return (
                        <Badge key={code} variant="outline" className="text-xs">
                          {s ? s.name : code}
                        </Badge>
                      );
                    })}
                    {b.subjects.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{b.subjects.length - 3} more
                      </Badge>
                    )}
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAssignFaculty(b)}
                      className="gap-2"
                    >
                      <Users className="h-4 w-4" /> Assign Faculty
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditBatch(b)}
                      className="gap-2"
                    >
                      <Edit className="h-4 w-4" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBatch(b.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Batches Summary ({filtered.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch Name</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Subjects Assigned</TableHead>
                    <TableHead>Faculty Assigned</TableHead>
                    <TableHead>Total Weekly Classes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((b) => (
                    <TableRow key={b.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{b.id}</TableCell>
                      <TableCell>{b.semester}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {b.subjects.slice(0, 3).map((code) => {
                            const s = availableSubjects.find(
                              (x) => x.code === code,
                            );
                            return (
                              <Badge
                                key={code}
                                variant="outline"
                                className="text-xs"
                              >
                                {s ? `${s.code}` : code}
                              </Badge>
                            );
                          })}
                          {b.subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{b.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {b.subjects.slice(0, 3).map((code) => (
                            <Badge
                              key={code}
                              variant="outline"
                              className="text-xs"
                            >
                              {b.facultyBySubject[code] || "-"}
                            </Badge>
                          ))}
                          {b.subjects.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{b.subjects.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{totalWeeklyClasses(b)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openAssignFaculty(b)}
                            className="gap-2"
                          >
                            <Users className="h-4 w-4" /> Assign
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditBatch(b)}
                            className="gap-2"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeBatch(b.id)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-8"
                      >
                        No batches found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={openAddBatch}
          className="fixed bottom-6 right-6 z-40 gap-2 shadow-lg"
        >
          <Plus className="h-4 w-4" /> Add Batch
        </Button>
      </main>

      <Dialog open={isBatchDialogOpen} onOpenChange={setIsBatchDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {editingBatch ? "Edit Batch" : "Add New Batch"}
            </DialogTitle>
            <DialogDescription>
              Provide batch details and assign subjects.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batch-id">Batch ID</Label>
                <Input
                  id="batch-id"
                  value={batchForm.id}
                  onChange={(e) =>
                    setBatchForm({ ...batchForm, id: e.target.value })
                  }
                  placeholder="e.g., CS-A-2024"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={batchForm.year}
                  onChange={(e) =>
                    setBatchForm({ ...batchForm, year: e.target.value })
                  }
                  placeholder="e.g., 2024"
                />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select
                  value={batchForm.department}
                  onValueChange={(v) =>
                    setBatchForm({ ...batchForm, department: v })
                  }
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
                <Label>Semester</Label>
                <Select
                  value={batchForm.semester}
                  onValueChange={(v) =>
                    setBatchForm({ ...batchForm, semester: v })
                  }
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
              <Label>Assign Subjects</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border rounded-lg p-4 max-h-48 overflow-auto">
                {availableSubjects.map((s) => (
                  <label key={s.code} className="flex items-center gap-2">
                    <Checkbox
                      checked={batchForm.subjects.includes(s.code)}
                      onCheckedChange={(checked) => {
                        const on = Boolean(checked);
                        setBatchForm((prev) => ({
                          ...prev,
                          subjects: on
                            ? [...prev.subjects, s.code]
                            : prev.subjects.filter((c) => c !== s.code),
                        }));
                      }}
                    />
                    <span className="text-sm">
                      {s.code} - {s.name} ({s.weeklyHours}h/wk)
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsBatchDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveBatch}>
              {editingBatch ? "Update Batch" : "Add Batch"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Assign Faculty</DialogTitle>
            <DialogDescription>
              Assign faculty for each subject in this batch.
            </DialogDescription>
          </DialogHeader>
          {assignBatch && (
            <div className="space-y-4">
              {assignBatch.subjects.length === 0 ? (
                <div className="text-sm text-muted-foreground">
                  No subjects assigned to this batch.
                </div>
              ) : (
                assignBatch.subjects.map((code) => {
                  const subj = availableSubjects.find((s) => s.code === code);
                  return (
                    <div
                      key={code}
                      className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center"
                    >
                      <div className="md:col-span-2">
                        <div className="font-medium text-sm">
                          {code} - {subj?.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Weekly {subj?.weeklyHours}h
                        </div>
                      </div>
                      <Select
                        value={assignBatch.facultyBySubject[code] || ""}
                        onValueChange={(v) => setFacultyFor(code, v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {facultyList.map((f) => (
                            <SelectItem key={f} value={f}>
                              {f}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                })
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveAssignments}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
