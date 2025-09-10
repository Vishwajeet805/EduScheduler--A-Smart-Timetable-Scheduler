import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
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
  Sparkles,
  MapPin,
  CheckCircle,
  Search,
  Eye,
  Check,
  XCircle,
  Edit,
  Filter,
  Download,
  Clock,
  User,
  Building,
  CalendarDays,
  FileText,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  BookOpen,
  Layers,
  BarChart3,
  Bell,
  Settings
} from "lucide-react";
import { toast } from "sonner";

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

interface TimetableEntry {
  timeSlot: string;
  subject: string;
  faculty: string;
  classroom: string;
  batch: string;
}

interface Timetable {
  id: string;
  department: string;
  semester: string;
  batch: string;
  createdBy: string;
  dateCreated: string;
  lastModified: string;
  status: 'pending' | 'approved' | 'rejected';
  comments?: string;
  schedule: {
    [day: string]: TimetableEntry[];
  };
  totalHours: number;
  conflictCount: number;
}

const mockTimetables: Timetable[] = [
  {
    id: "TT001",
    department: "Computer Science",
    semester: "5th Semester",
    batch: "CS-A",
    createdBy: "Dr. Sarah Smith",
    dateCreated: "2024-01-15",
    lastModified: "2024-01-16",
    status: "pending",
    totalHours: 24,
    conflictCount: 0,
    schedule: {
      monday: [
        { timeSlot: "09:00-10:00", subject: "Data Structures", faculty: "Dr. Smith", classroom: "A-101", batch: "CS-A" },
        { timeSlot: "10:00-11:00", subject: "Algorithms", faculty: "Prof. Johnson", classroom: "A-102", batch: "CS-A" },
        { timeSlot: "11:00-12:00", subject: "Computer Networks", faculty: "Dr. Davis", classroom: "B-201", batch: "CS-A" },
        { timeSlot: "14:00-15:00", subject: "Database Systems", faculty: "Prof. Wilson", classroom: "A-101", batch: "CS-A" },
      ],
      tuesday: [
        { timeSlot: "09:00-10:00", subject: "Software Engineering", faculty: "Dr. Brown", classroom: "A-103", batch: "CS-A" },
        { timeSlot: "10:00-11:00", subject: "Operating Systems", faculty: "Prof. Taylor", classroom: "B-202", batch: "CS-A" },
        { timeSlot: "13:00-14:00", subject: "Web Development Lab", faculty: "Dr. Smith", classroom: "Lab-1", batch: "CS-A" },
        { timeSlot: "15:00-16:00", subject: "Data Structures Lab", faculty: "Prof. Johnson", classroom: "Lab-2", batch: "CS-A" },
      ],
      // Add more days as needed
    }
  },
  {
    id: "TT002",
    department: "Computer Science",
    semester: "3rd Semester",
    batch: "CS-B",
    createdBy: "Prof. Michael Johnson",
    dateCreated: "2024-01-12",
    lastModified: "2024-01-14",
    status: "approved",
    totalHours: 22,
    conflictCount: 0,
    schedule: {
      monday: [
        { timeSlot: "09:00-10:00", subject: "Digital Logic", faculty: "Dr. Wilson", classroom: "A-104", batch: "CS-B" },
        { timeSlot: "11:00-12:00", subject: "Programming Fundamentals", faculty: "Prof. Davis", classroom: "Lab-3", batch: "CS-B" },
      ],
      // More schedule data...
    }
  },
  {
    id: "TT003",
    department: "Electronics",
    semester: "4th Semester",
    batch: "EC-A",
    createdBy: "Dr. Emily Davis",
    dateCreated: "2024-01-10",
    lastModified: "2024-01-11",
    status: "rejected",
    comments: "Faculty availability conflicts detected for Tuesday 2-3 PM slot. Please reassign Dr. Kumar's classes.",
    totalHours: 26,
    conflictCount: 2,
    schedule: {
      monday: [
        { timeSlot: "09:00-10:00", subject: "Electronics Circuits", faculty: "Dr. Kumar", classroom: "D-101", batch: "EC-A" },
        { timeSlot: "10:00-11:00", subject: "Signal Processing", faculty: "Prof. Sharma", classroom: "D-102", batch: "EC-A" },
      ],
      // More schedule data...
    }
  },
  {
    id: "TT004",
    department: "Mechanical",
    semester: "6th Semester",
    batch: "ME-A",
    createdBy: "Prof. Robert Chen",
    dateCreated: "2024-01-08",
    lastModified: "2024-01-09",
    status: "pending",
    totalHours: 25,
    conflictCount: 1,
    schedule: {
      monday: [
        { timeSlot: "09:00-10:00", subject: "Thermodynamics", faculty: "Dr. Chen", classroom: "C-201", batch: "ME-A" },
        { timeSlot: "11:00-12:00", subject: "Machine Design", faculty: "Prof. Patel", classroom: "C-202", batch: "ME-A" },
      ],
      // More schedule data...
    }
  }
];

const departments = ["All Departments", "Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"];
const semesters = ["All Semesters", "1st Semester", "2nd Semester", "3rd Semester", "4th Semester", "5th Semester", "6th Semester", "7th Semester", "8th Semester"];
const batches = ["All Batches", "A", "B", "C"];

const timeSlots = [
  "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
  "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
];

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

export default function ReviewTimetables() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const [timetables, setTimetables] = useState<Timetable[]>(mockTimetables);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [batchFilter, setBatchFilter] = useState("All Batches");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [selectedTimetable, setSelectedTimetable] = useState<Timetable | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [suggestionComments, setSuggestionComments] = useState("");

  const filteredTimetables = timetables.filter(tt => {
    const matchesSearch = tt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tt.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tt.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tt.createdBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === "All Departments" || tt.department === departmentFilter;
    const matchesSemester = semesterFilter === "All Semesters" || tt.semester === semesterFilter;
    const matchesBatch = batchFilter === "All Batches" || tt.batch.includes(batchFilter);
    const matchesStatus = statusFilter === "all" || tt.status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesSemester && matchesBatch && matchesStatus;
  });

  const openPreviewModal = (timetable: Timetable) => {
    setSelectedTimetable(timetable);
    setIsPreviewModalOpen(true);
  };

  const openRejectModal = (timetable: Timetable) => {
    setSelectedTimetable(timetable);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const openCommentModal = (timetable: Timetable) => {
    setSelectedTimetable(timetable);
    setSuggestionComments("");
    setIsCommentModalOpen(true);
  };

  const approveTimetable = (timetableId: string) => {
    setTimetables(timetables.map(tt => 
      tt.id === timetableId 
        ? { ...tt, status: 'approved' as const, lastModified: new Date().toISOString().split('T')[0] }
        : tt
    ));
    toast.success("Timetable approved successfully", {
      description: "The timetable has been marked as approved and is now active."
    });
    setIsPreviewModalOpen(false);
  };

  const rejectTimetable = () => {
    if (!selectedTimetable || !rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setTimetables(timetables.map(tt => 
      tt.id === selectedTimetable.id 
        ? { 
            ...tt, 
            status: 'rejected' as const, 
            comments: rejectionReason,
            lastModified: new Date().toISOString().split('T')[0]
          }
        : tt
    ));
    
    toast.error("Timetable rejected", {
      description: "The timetable has been rejected with your feedback."
    });
    
    setIsRejectModalOpen(false);
    setSelectedTimetable(null);
  };

  const addSuggestions = () => {
    if (!selectedTimetable || !suggestionComments.trim()) {
      toast.error("Please provide your suggestions");
      return;
    }

    setTimetables(timetables.map(tt => 
      tt.id === selectedTimetable.id 
        ? { 
            ...tt, 
            comments: suggestionComments,
            lastModified: new Date().toISOString().split('T')[0]
          }
        : tt
    ));
    
    toast.success("Suggestions added", {
      description: "Your suggestions have been sent to the timetable creator."
    });
    
    setIsCommentModalOpen(false);
    setSelectedTimetable(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return CheckCircle2;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
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
                <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Review Timetables
                </h1>
                <p className="text-sm text-muted-foreground">Review, approve, and manage generated timetables</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {/* Search and Filter Section */}
          <Card className="border-0 shadow-sm mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search timetables by ID, department, batch, or creator..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={semesterFilter} onValueChange={setSemesterFilter}>
                  <SelectTrigger>
                    <CalendarDays className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((sem) => (
                      <SelectItem key={sem} value={sem}>{sem}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Timetables</p>
                    <p className="text-2xl font-bold text-primary">{timetables.length}</p>
                  </div>
                  <FileText className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                    <p className="text-2xl font-bold text-orange-600">{timetables.filter(tt => tt.status === 'pending').length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{timetables.filter(tt => tt.status === 'approved').length}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">{timetables.filter(tt => tt.status === 'rejected').length}</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-600/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timetables Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Timetables ({filteredTimetables.length})
                <div className="ml-auto">
                  <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timetable ID</TableHead>
                    <TableHead>Department / Batch</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Date Created</TableHead>
                    <TableHead>Total Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimetables.map((timetable) => {
                    const StatusIcon = getStatusIcon(timetable.status);
                    return (
                      <TableRow key={timetable.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{timetable.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{timetable.department}</div>
                            <div className="text-sm text-muted-foreground">
                              {timetable.semester} - Batch {timetable.batch}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {timetable.createdBy}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div>{new Date(timetable.dateCreated).toLocaleDateString()}</div>
                            <div className="text-sm text-muted-foreground">
                              Modified: {new Date(timetable.lastModified).toLocaleDateString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            {timetable.totalHours}h
                            {timetable.conflictCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {timetable.conflictCount} conflicts
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(timetable.status)} className="capitalize flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {timetable.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openPreviewModal(timetable)}
                              className="h-8 w-8 p-0"
                              title="View Timetable"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {timetable.status === 'pending' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => approveTimetable(timetable.id)}
                                  className="h-8 w-8 p-0 text-green-600 hover:text-green-600"
                                  title="Approve"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openRejectModal(timetable)}
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-600"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCommentModal(timetable)}
                                  className="h-8 w-8 p-0 text-blue-600 hover:text-blue-600"
                                  title="Suggest Changes"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              {filteredTimetables.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No timetables found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Timetable Preview Modal */}
        <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {selectedTimetable?.department} - {selectedTimetable?.semester} - Batch {selectedTimetable?.batch}
              </DialogTitle>
              <DialogDescription>
                Created by {selectedTimetable?.createdBy} on {selectedTimetable?.dateCreated}
              </DialogDescription>
            </DialogHeader>
            
            {selectedTimetable && (
              <div className="space-y-4">
                {/* Timetable Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Timetable ID</p>
                    <p className="font-medium">{selectedTimetable.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Hours</p>
                    <p className="font-medium">{selectedTimetable.totalHours} hours</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(selectedTimetable.status)} className="capitalize">
                      {selectedTimetable.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Conflicts</p>
                    <p className="font-medium text-red-600">{selectedTimetable.conflictCount} conflicts</p>
                  </div>
                </div>

                {/* Weekly Schedule Grid */}
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-24">Time</TableHead>
                        {weekDays.map((day) => (
                          <TableHead key={day} className="text-center capitalize">{day}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timeSlots.map((slot) => (
                        <TableRow key={slot}>
                          <TableCell className="font-medium text-sm">{slot}</TableCell>
                          {weekDays.map((day) => {
                            const daySchedule = selectedTimetable.schedule[day] || [];
                            const slotEntry = daySchedule.find(entry => entry.timeSlot === slot);
                            return (
                              <TableCell key={day} className="text-center p-2">
                                {slotEntry ? (
                                  <div className="bg-primary/10 border border-primary/20 rounded p-2 text-xs">
                                    <div className="font-semibold text-primary">{slotEntry.subject}</div>
                                    <div className="text-muted-foreground">{slotEntry.faculty}</div>
                                    <div className="text-muted-foreground">{slotEntry.classroom}</div>
                                  </div>
                                ) : (
                                  <div className="text-muted-foreground text-xs">Free</div>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Comments Section */}
                {selectedTimetable.comments && (
                  <div className="p-4 bg-muted/20 border rounded-lg">
                    <Label className="text-base font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Comments
                    </Label>
                    <p className="mt-2 text-sm">{selectedTimetable.comments}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              {selectedTimetable?.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openRejectModal(selectedTimetable)}
                    className="gap-2 text-red-600 hover:text-red-600"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => openCommentModal(selectedTimetable)}
                    className="gap-2 text-blue-600 hover:text-blue-600"
                  >
                    <Edit className="h-4 w-4" />
                    Suggest Changes
                  </Button>
                  <Button
                    onClick={() => approveTimetable(selectedTimetable.id)}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
              <Button variant="outline" onClick={() => setIsPreviewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Modal */}
        <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                Reject Timetable
              </DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this timetable. This feedback will be sent to the creator.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="reason">Rejection Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="Please specify the issues with this timetable..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={rejectTimetable} className="gap-2">
                <XCircle className="h-4 w-4" />
                Reject Timetable
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Suggest Changes Modal */}
        <Dialog open={isCommentModalOpen} onOpenChange={setIsCommentModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-blue-600">
                <Edit className="h-5 w-5" />
                Suggest Changes
              </DialogTitle>
              <DialogDescription>
                Provide suggestions for improving this timetable. Your comments will be sent to the creator.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="suggestions">Suggestions *</Label>
                <Textarea
                  id="suggestions"
                  placeholder="Please provide your suggestions for improvement..."
                  value={suggestionComments}
                  onChange={(e) => setSuggestionComments(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCommentModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={addSuggestions} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Suggestions
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
