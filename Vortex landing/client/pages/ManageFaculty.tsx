import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ThemeToggle } from "@/components/theme-toggle";
import { useEduStore } from "@/state/store";
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
  Sparkles,
  MapPin,
  CheckCircle,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  BookOpen,
  Clock,
  Filter,
  Download,
  Mail,
  Phone,
  User,
  Building,
  Calendar as CalendarIcon,
  Layers,
  BarChart3,
  Bell,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

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

interface Faculty {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  subjects: string[];
  weeklyLoadHours: number;
  availability: {
    [key: string]: string[]; // day -> time slots
  };
  status: "active" | "inactive";
  joiningDate: string;
}

const mockFacultyData: Faculty[] = [
  {
    id: "FAC001",
    name: "Dr. Sarah Smith",
    email: "sarah.smith@university.edu",
    phone: "+1-555-0123",
    department: "Computer Science",
    subjects: ["Data Structures", "Algorithms", "Computer Networks"],
    weeklyLoadHours: 18,
    availability: {
      monday: ["09:00-10:00", "11:00-12:00", "14:00-15:00"],
      tuesday: ["10:00-11:00", "13:00-14:00", "15:00-16:00"],
      wednesday: ["09:00-10:00", "11:00-12:00"],
      thursday: ["10:00-11:00", "14:00-15:00", "16:00-17:00"],
      friday: ["09:00-10:00", "13:00-14:00"],
    },
    status: "active",
    joiningDate: "2020-08-15",
  },
  {
    id: "FAC002",
    name: "Prof. Michael Johnson",
    email: "m.johnson@university.edu",
    phone: "+1-555-0124",
    department: "Computer Science",
    subjects: ["Database Systems", "Software Engineering", "Web Development"],
    weeklyLoadHours: 16,
    availability: {
      monday: ["10:00-11:00", "15:00-16:00"],
      tuesday: ["09:00-10:00", "14:00-15:00", "16:00-17:00"],
      wednesday: ["11:00-12:00", "13:00-14:00"],
      thursday: ["09:00-10:00", "15:00-16:00"],
      friday: ["10:00-11:00", "14:00-15:00"],
      saturday: ["09:00-10:00"],
    },
    status: "active",
    joiningDate: "2019-01-10",
  },
  {
    id: "FAC003",
    name: "Dr. Emily Davis",
    email: "emily.davis@university.edu",
    phone: "+1-555-0125",
    department: "Electronics",
    subjects: ["Digital Electronics", "Microprocessors", "VLSI Design"],
    weeklyLoadHours: 20,
    availability: {
      monday: ["09:00-10:00", "11:00-12:00", "14:00-15:00", "16:00-17:00"],
      tuesday: ["10:00-11:00", "13:00-14:00"],
      wednesday: ["09:00-10:00", "15:00-16:00"],
      thursday: ["11:00-12:00", "14:00-15:00"],
      friday: ["09:00-10:00", "13:00-14:00", "16:00-17:00"],
    },
    status: "active",
    joiningDate: "2021-03-22",
  },
];

const departments = [
  "Computer Science",
  "Electronics",
  "Mechanical",
  "Civil",
  "Electrical",
];
const allSubjects = [
  "Data Structures",
  "Algorithms",
  "Computer Networks",
  "Database Systems",
  "Software Engineering",
  "Web Development",
  "Digital Electronics",
  "Microprocessors",
  "VLSI Design",
  "Machine Learning",
  "Artificial Intelligence",
  "Operating Systems",
];

const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-13:00",
  "13:00-14:00",
  "14:00-15:00",
  "15:00-16:00",
  "16:00-17:00",
];

const weekDays = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export default function ManageFaculty() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const {
    state,
    upsertFaculty: upsertToStore,
    deleteFaculty: deleteFromStore,
  } = useEduStore();
  const faculty: Faculty[] = state.faculties.map((f) => ({
    id: f.id,
    name: f.name,
    email: f.email || "",
    phone: f.phone || "",
    department: f.department,
    subjects: f.assignedSubjects || [],
    weeklyLoadHours:
      Number(f.weeklyLoadHours) || Number(f.maxClassesPerWeek) || 18,
    availability: f.availability || {},
    status: f.status || "active",
    joiningDate: f.joiningDate || new Date().toISOString().split("T")[0],
  }));
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  // Form state for add/edit faculty
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    subjects: [] as string[],
    weeklyLoadHours: 18,
    availability: {} as { [key: string]: string[] },
    status: "active" as "active" | "inactive",
  });

  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.subjects.some((s) =>
        s.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    const matchesDepartment =
      departmentFilter === "all" || f.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  const openAddModal = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      department: "",
      subjects: [],
      weeklyLoadHours: 18,
      availability: {},
      status: "active",
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (facultyMember: Faculty) => {
    setSelectedFaculty(facultyMember);
    setFormData({
      name: facultyMember.name,
      email: facultyMember.email,
      phone: facultyMember.phone,
      department: facultyMember.department,
      subjects: facultyMember.subjects,
      weeklyLoadHours: facultyMember.weeklyLoadHours,
      availability: facultyMember.availability,
      status: facultyMember.status,
    });
    setIsEditModalOpen(true);
  };

  const openScheduleModal = (facultyMember: Faculty) => {
    setSelectedFaculty(facultyMember);
    setIsScheduleModalOpen(true);
  };

  const handleSubjectChange = (subject: string, checked: boolean) => {
    if (checked) {
      setFormData({ ...formData, subjects: [...formData.subjects, subject] });
    } else {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter((s) => s !== subject),
      });
    }
  };

  const handleAvailabilityChange = (
    day: string,
    timeSlot: string,
    checked: boolean,
  ) => {
    const daySlots = formData.availability[day] || [];
    if (checked) {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: [...daySlots, timeSlot],
        },
      });
    } else {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: daySlots.filter((slot) => slot !== timeSlot),
        },
      });
    }
  };

  const saveFaculty = () => {
    if (
      !formData.name ||
      !formData.department ||
      formData.subjects.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newFaculty: Faculty = {
      id: isEditModalOpen
        ? selectedFaculty!.id
        : `FAC${String(faculty.length + 1).padStart(3, "0")}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      subjects: formData.subjects,
      weeklyLoadHours: formData.weeklyLoadHours,
      availability: formData.availability,
      status: formData.status,
      joiningDate: isEditModalOpen
        ? selectedFaculty!.joiningDate
        : new Date().toISOString().split("T")[0],
    };

    if (isEditModalOpen) {
      upsertToStore({
        id: selectedFaculty!.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        assignedSubjects: formData.subjects,
        maxClassesPerWeek: formData.weeklyLoadHours,
        avgLeavesPerMonth: 0,
        weeklyLoadHours: formData.weeklyLoadHours,
        availability: formData.availability,
        status: formData.status,
        joiningDate: selectedFaculty!.joiningDate,
      } as any);
      toast.success("Faculty member updated successfully");
    } else {
      upsertToStore({
        id: newFaculty.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        assignedSubjects: formData.subjects,
        maxClassesPerWeek: formData.weeklyLoadHours,
        avgLeavesPerMonth: 0,
        weeklyLoadHours: formData.weeklyLoadHours,
        availability: formData.availability,
        status: formData.status,
        joiningDate: new Date().toISOString().split("T")[0],
      } as any);
      toast.success("Faculty member added successfully");
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedFaculty(null);
  };

  const deleteFacultyLocal = (id: string) => {
    deleteFromStore(id);
    toast.success("Faculty member deleted successfully");
  };

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
      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transform transition-transform duration-200 ease-in-out
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
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
                        ${
                          isActive
                            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                            : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground hover:shadow-sm"
                        }
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

          {/* Footer */}
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
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Manage Faculty
                </h1>
                <p className="text-sm text-muted-foreground">
                  Add, edit, and manage faculty members and their schedules
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={openAddModal} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Faculty
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Search and Filter Section */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search faculty by name, department, or subjects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select
                  value={departmentFilter}
                  onValueChange={setDepartmentFilter}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Faculty
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {faculty.length}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Active Faculty
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {faculty.filter((f) => f.status === "active").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Departments
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Set(faculty.map((f) => f.department)).size}
                    </p>
                  </div>
                  <Building className="h-8 w-8 text-blue-600/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Avg Load Hours
                    </p>
                    <p className="text-2xl font-bold text-purple-600">
                      {faculty.length
                        ? Math.round(
                            faculty.reduce(
                              (acc, f) => acc + f.weeklyLoadHours,
                              0,
                            ) / faculty.length,
                          )
                        : 0}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Faculty Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Faculty Members ({filteredFaculty.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Faculty ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Subjects Assigned</TableHead>
                    <TableHead>Weekly Load</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFaculty.map((facultyMember) => (
                    <TableRow
                      key={facultyMember.id}
                      className="hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        {facultyMember.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {facultyMember.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {facultyMember.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{facultyMember.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {facultyMember.subjects.slice(0, 2).map((subject) => (
                            <Badge
                              key={subject}
                              variant="outline"
                              className="text-xs"
                            >
                              {subject}
                            </Badge>
                          ))}
                          {facultyMember.subjects.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{facultyMember.subjects.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{facultyMember.weeklyLoadHours}h</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            facultyMember.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {facultyMember.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openScheduleModal(facultyMember)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(facultyMember)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteFacultyLocal(facultyMember.id)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredFaculty.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No faculty members found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Faculty Modal */}
        <Dialog
          open={isAddModalOpen || isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              setSelectedFaculty(null);
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {isEditModalOpen
                  ? "Edit Faculty Member"
                  : "Add New Faculty Member"}
              </DialogTitle>
              <DialogDescription>
                {isEditModalOpen
                  ? "Update faculty member information and schedule"
                  : "Fill in the details to add a new faculty member"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Dr. John Smith"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData({ ...formData, department: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.smith@university.edu"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1-555-0123"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyLoad">Weekly Load Hours</Label>
                  <Select
                    value={formData.weeklyLoadHours.toString()}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        weeklyLoadHours: parseInt(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 12, 14, 16, 18, 20, 22, 24].map((hours) => (
                        <SelectItem key={hours} value={hours.toString()}>
                          {hours} hours
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: "active" | "inactive") =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subjects */}
              <div className="space-y-3">
                <Label>Subjects Assigned *</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                  {allSubjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) =>
                          handleSubjectChange(subject, checked as boolean)
                        }
                      />
                      <Label htmlFor={subject} className="text-sm font-normal">
                        {subject}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-3">
                <Label>Availability Schedule</Label>
                <div className="border rounded-lg p-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Day</TableHead>
                        {timeSlots.map((slot) => (
                          <TableHead key={slot} className="text-center text-xs">
                            {slot}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekDays.map((day) => (
                        <TableRow key={day}>
                          <TableCell className="font-medium capitalize">
                            {day}
                          </TableCell>
                          {timeSlots.map((slot) => (
                            <TableCell key={slot} className="text-center">
                              <Checkbox
                                checked={
                                  formData.availability[day]?.includes(slot) ||
                                  false
                                }
                                onCheckedChange={(checked) =>
                                  handleAvailabilityChange(
                                    day,
                                    slot,
                                    checked as boolean,
                                  )
                                }
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveFaculty}>
                {isEditModalOpen ? "Update Faculty" : "Add Faculty"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Preview Modal */}
        <Dialog
          open={isScheduleModalOpen}
          onOpenChange={setIsScheduleModalOpen}
        >
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedFaculty?.name} - Weekly Schedule
              </DialogTitle>
              <DialogDescription>
                Current weekly timetable and availability for{" "}
                {selectedFaculty?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedFaculty && (
              <div className="space-y-4">
                {/* Faculty Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Department</p>
                    <p className="font-medium">{selectedFaculty.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Weekly Load</p>
                    <p className="font-medium">
                      {selectedFaculty.weeklyLoadHours} hours
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subjects</p>
                    <p className="font-medium">
                      {selectedFaculty.subjects.length} subjects
                    </p>
                  </div>
                </div>

                {/* Schedule Grid */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Time</TableHead>
                        {weekDays.map((day) => (
                          <TableHead
                            key={day}
                            className="text-center capitalize"
                          >
                            {day}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map((slot) => (
                        <TableRow key={slot}>
                          <TableCell className="font-medium text-sm">
                            {slot}
                          </TableCell>
                          {weekDays.map((day) => {
                            const isAvailable =
                              selectedFaculty.availability[day]?.includes(slot);
                            return (
                              <TableCell key={day} className="text-center">
                                {isAvailable ? (
                                  <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-2 rounded text-xs">
                                    Available
                                  </div>
                                ) : (
                                  <div className="bg-gray-100 dark:bg-gray-800 text-gray-500 p-2 rounded text-xs">
                                    Not Available
                                  </div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Subjects List */}
                <div>
                  <Label className="text-base font-medium">
                    Assigned Subjects
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedFaculty.subjects.map((subject) => (
                      <Badge key={subject} variant="outline">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsScheduleModalOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
