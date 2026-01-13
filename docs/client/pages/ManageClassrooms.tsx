import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
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
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Filter,
  Download,
  Building,
  Settings,
  Monitor,
  Wifi,
  Snowflake,
  FlaskConical,
  Projector,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  BookOpen,
  Layers,
  BarChart3,
  Bell
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

interface Classroom {
  id: string;
  name: string;
  number: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'tutorial' | 'seminar';
  resources: string[];
  availability: {
    [key: string]: string[];  // day -> time slots
  };
  status: 'active' | 'maintenance' | 'inactive';
  floor: string;
  building: string;
}

const mockClassroomData: Classroom[] = [
  {
    id: "CLS001",
    name: "Main Lecture Hall",
    number: "A-101",
    capacity: 120,
    type: "lecture",
    resources: ["Projector", "Smartboard", "AC", "Audio System", "WiFi"],
    availability: {
      monday: ["09:00-10:00", "11:00-12:00", "14:00-15:00", "16:00-17:00"],
      tuesday: ["10:00-11:00", "13:00-14:00", "15:00-16:00"],
      wednesday: ["09:00-10:00", "11:00-12:00", "14:00-15:00"],
      thursday: ["10:00-11:00", "14:00-15:00", "16:00-17:00"],
      friday: ["09:00-10:00", "13:00-14:00"],
      saturday: ["09:00-10:00", "10:00-11:00"]
    },
    status: 'active',
    floor: "1st Floor",
    building: "Academic Block A"
  },
  {
    id: "CLS002",
    name: "Computer Lab",
    number: "B-201",
    capacity: 40,
    type: "lab",
    resources: ["Computers", "Projector", "AC", "WiFi", "Lab Equipment"],
    availability: {
      monday: ["10:00-11:00", "15:00-16:00"],
      tuesday: ["09:00-10:00", "14:00-15:00", "16:00-17:00"],
      wednesday: ["11:00-12:00", "13:00-14:00"],
      thursday: ["09:00-10:00", "15:00-16:00"],
      friday: ["10:00-11:00", "14:00-15:00"],
      saturday: ["09:00-10:00"]
    },
    status: 'active',
    floor: "2nd Floor",
    building: "Academic Block B"
  },
  {
    id: "CLS003",
    name: "Tutorial Room",
    number: "C-301",
    capacity: 25,
    type: "tutorial",
    resources: ["Whiteboard", "AC", "WiFi"],
    availability: {
      monday: ["09:00-10:00", "11:00-12:00", "14:00-15:00", "16:00-17:00"],
      tuesday: ["10:00-11:00", "13:00-14:00"],
      wednesday: ["09:00-10:00", "15:00-16:00"],
      thursday: ["11:00-12:00", "14:00-15:00"],
      friday: ["09:00-10:00", "13:00-14:00", "16:00-17:00"]
    },
    status: 'active',
    floor: "3rd Floor",
    building: "Academic Block C"
  },
  {
    id: "CLS004",
    name: "Electronics Lab",
    number: "D-105",
    capacity: 35,
    type: "lab",
    resources: ["Lab Equipment", "Oscilloscopes", "Projector", "AC", "WiFi"],
    availability: {
      monday: ["09:00-10:00", "14:00-15:00"],
      tuesday: ["11:00-12:00", "15:00-16:00"],
      wednesday: ["10:00-11:00", "13:00-14:00"],
      thursday: ["09:00-10:00", "16:00-17:00"],
      friday: ["11:00-12:00", "14:00-15:00"]
    },
    status: 'maintenance',
    floor: "1st Floor",
    building: "Academic Block D"
  }
];

const classroomTypes = ["lecture", "lab", "tutorial", "seminar"];
const availableResources = [
  "Projector", "Smartboard", "Whiteboard", "AC", "WiFi", "Audio System", 
  "Computers", "Lab Equipment", "Oscilloscopes", "Microscopes", "3D Printer"
];

const timeSlots = [
  "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00",
  "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00"
];

const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

const buildings = ["Academic Block A", "Academic Block B", "Academic Block C", "Academic Block D"];

export default function ManageClassrooms() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  
  const [classrooms, setClassrooms] = useState<Classroom[]>(mockClassroomData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);

  // Form state for add/edit classroom
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    capacity: 30,
    type: 'lecture' as 'lecture' | 'lab' | 'tutorial' | 'seminar',
    resources: [] as string[],
    availability: {} as {[key: string]: string[]},
    status: 'active' as 'active' | 'maintenance' | 'inactive',
    floor: "",
    building: ""
  });

  const filteredClassrooms = classrooms.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.building.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         c.resources.some(r => r.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === "all" || c.type === typeFilter;
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const openAddModal = () => {
    setFormData({
      name: "",
      number: "",
      capacity: 30,
      type: 'lecture',
      resources: [],
      availability: {},
      status: 'active',
      floor: "",
      building: ""
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setFormData({
      name: classroom.name,
      number: classroom.number,
      capacity: classroom.capacity,
      type: classroom.type,
      resources: classroom.resources,
      availability: classroom.availability,
      status: classroom.status,
      floor: classroom.floor,
      building: classroom.building
    });
    setIsEditModalOpen(true);
  };

  const openScheduleModal = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
    setIsScheduleModalOpen(true);
  };

  const handleResourceChange = (resource: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, resources: [...formData.resources, resource]});
    } else {
      setFormData({...formData, resources: formData.resources.filter(r => r !== resource)});
    }
  };

  const handleAvailabilityChange = (day: string, timeSlot: string, checked: boolean) => {
    const daySlots = formData.availability[day] || [];
    if (checked) {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: [...daySlots, timeSlot]
        }
      });
    } else {
      setFormData({
        ...formData,
        availability: {
          ...formData.availability,
          [day]: daySlots.filter(slot => slot !== timeSlot)
        }
      });
    }
  };

  const saveClassroom = () => {
    if (!formData.name || !formData.number || !formData.building) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newClassroom: Classroom = {
      id: isEditModalOpen ? selectedClassroom!.id : `CLS${String(classrooms.length + 1).padStart(3, '0')}`,
      name: formData.name,
      number: formData.number,
      capacity: formData.capacity,
      type: formData.type,
      resources: formData.resources,
      availability: formData.availability,
      status: formData.status,
      floor: formData.floor,
      building: formData.building
    };

    if (isEditModalOpen) {
      setClassrooms(classrooms.map(c => c.id === selectedClassroom!.id ? newClassroom : c));
      toast.success("Classroom updated successfully");
    } else {
      setClassrooms([...classrooms, newClassroom]);
      toast.success("Classroom added successfully");
    }

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setSelectedClassroom(null);
  };

  const deleteClassroom = (id: string) => {
    setClassrooms(classrooms.filter(c => c.id !== id));
    toast.success("Classroom deleted successfully");
  };

  const getResourceIcon = (resource: string) => {
    const iconMap: {[key: string]: any} = {
      "Projector": Projector,
      "Smartboard": Monitor,
      "AC": Snowflake,
      "WiFi": Wifi,
      "Computers": Monitor,
      "Lab Equipment": FlaskConical,
      "Audio System": Settings
    };
    return iconMap[resource] || Settings;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'maintenance': return 'destructive';
      case 'inactive': return 'secondary';
      default: return 'outline';
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
                  <Building className="h-5 w-5 text-primary" />
                  Manage Classrooms
                </h1>
                <p className="text-sm text-muted-foreground">Configure classroom details, capacity, and available resources</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button onClick={openAddModal} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Classroom
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
                    placeholder="Search classrooms by name, number, building, or resources..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {classroomTypes.map((type) => (
                      <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
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
                    <p className="text-sm font-medium text-muted-foreground">Total Classrooms</p>
                    <p className="text-2xl font-bold text-primary">{classrooms.length}</p>
                  </div>
                  <Building className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Rooms</p>
                    <p className="text-2xl font-bold text-green-600">{classrooms.filter(c => c.status === 'active').length}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Capacity</p>
                    <p className="text-2xl font-bold text-blue-600">{classrooms.reduce((acc, c) => acc + c.capacity, 0)}</p>
                  </div>
                  <UsersIcon className="h-8 w-8 text-blue-600/60" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Avg Capacity</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(classrooms.reduce((acc, c) => acc + c.capacity, 0) / classrooms.length)}
                    </p>
                  </div>
                  <School className="h-8 w-8 text-purple-600/60" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Classrooms Table */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Classrooms ({filteredClassrooms.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classroom ID</TableHead>
                    <TableHead>Room Name/Number</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Resources Available</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClassrooms.map((classroom) => (
                    <TableRow key={classroom.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{classroom.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{classroom.name}</div>
                          <div className="text-sm text-muted-foreground">{classroom.number} - {classroom.building}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UsersIcon className="h-4 w-4 text-muted-foreground" />
                          {classroom.capacity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {classroom.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {classroom.resources.slice(0, 3).map((resource) => {
                            const Icon = getResourceIcon(resource);
                            return (
                              <Badge key={resource} variant="outline" className="text-xs flex items-center gap-1">
                                <Icon className="h-3 w-3" />
                                {resource}
                              </Badge>
                            );
                          })}
                          {classroom.resources.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{classroom.resources.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(classroom.status)} className="capitalize">
                          {classroom.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openScheduleModal(classroom)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(classroom)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteClassroom(classroom.id)}
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
              
              {filteredClassrooms.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Building className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No classrooms found matching your criteria.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Classroom Modal */}
        <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setSelectedClassroom(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                {isEditModalOpen ? "Edit Classroom" : "Add New Classroom"}
              </DialogTitle>
              <DialogDescription>
                {isEditModalOpen ? "Update classroom information and schedule" : "Fill in the details to add a new classroom"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Classroom Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Main Lecture Hall"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number">Room Number *</Label>
                  <Input
                    id="number"
                    placeholder="e.g., A-101"
                    value={formData.number}
                    onChange={(e) => setFormData({...formData, number: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity (Students)</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="300"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 30})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Classroom Type</Label>
                  <Select value={formData.type} onValueChange={(value: 'lecture' | 'lab' | 'tutorial' | 'seminar') => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {classroomTypes.map((type) => (
                        <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="building">Building *</Label>
                  <Select value={formData.building} onValueChange={(value) => setFormData({...formData, building: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select building" />
                    </SelectTrigger>
                    <SelectContent>
                      {buildings.map((building) => (
                        <SelectItem key={building} value={building}>{building}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Select value={formData.floor} onValueChange={(value) => setFormData({...formData, floor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select floor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ground Floor">Ground Floor</SelectItem>
                      <SelectItem value="1st Floor">1st Floor</SelectItem>
                      <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                      <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                      <SelectItem value="4th Floor">4th Floor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'maintenance' | 'inactive') => setFormData({...formData, status: value})}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="maintenance">Under Maintenance</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Resources */}
              <div className="space-y-3">
                <Label>Available Resources</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto border rounded-lg p-4">
                  {availableResources.map((resource) => {
                    const Icon = getResourceIcon(resource);
                    return (
                      <div key={resource} className="flex items-center space-x-2">
                        <Checkbox
                          id={resource}
                          checked={formData.resources.includes(resource)}
                          onCheckedChange={(checked) => handleResourceChange(resource, checked as boolean)}
                        />
                        <Label htmlFor={resource} className="text-sm font-normal flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {resource}
                        </Label>
                      </div>
                    );
                  })}
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
                          <TableHead key={slot} className="text-center text-xs">{slot}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {weekDays.map((day) => (
                        <TableRow key={day}>
                          <TableCell className="font-medium capitalize">{day}</TableCell>
                          {timeSlots.map((slot) => (
                            <TableCell key={slot} className="text-center">
                              <Checkbox
                                checked={formData.availability[day]?.includes(slot) || false}
                                onCheckedChange={(checked) => handleAvailabilityChange(day, slot, checked as boolean)}
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
              <Button variant="outline" onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}>
                Cancel
              </Button>
              <Button onClick={saveClassroom}>
                {isEditModalOpen ? "Update Classroom" : "Add Classroom"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule Preview Modal */}
        <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedClassroom?.name} ({selectedClassroom?.number}) - Weekly Schedule
              </DialogTitle>
              <DialogDescription>
                Current weekly timetable and availability for {selectedClassroom?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedClassroom && (
              <div className="space-y-4">
                {/* Classroom Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Building</p>
                    <p className="font-medium">{selectedClassroom.building}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Capacity</p>
                    <p className="font-medium">{selectedClassroom.capacity} students</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{selectedClassroom.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(selectedClassroom.status)} className="capitalize">
                      {selectedClassroom.status}
                    </Badge>
                  </div>
                </div>

                {/* Schedule Grid */}
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
                            const isAvailable = selectedClassroom.availability[day]?.includes(slot);
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

                {/* Resources List */}
                <div>
                  <Label className="text-base font-medium">Available Resources</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedClassroom.resources.map((resource) => {
                      const Icon = getResourceIcon(resource);
                      return (
                        <Badge key={resource} variant="outline" className="flex items-center gap-1">
                          <Icon className="h-3 w-3" />
                          {resource}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsScheduleModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
