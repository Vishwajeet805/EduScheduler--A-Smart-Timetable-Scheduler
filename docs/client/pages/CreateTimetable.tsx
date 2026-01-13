import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme-toggle";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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
  BookOpen,
  Clock,
  Settings,
  Wand2,
  Plus,
  Trash2,
  Save,
  RotateCcw,
  Building,
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

interface Subject {
  id: string;
  name: string;
  code: string;
  weeklyHours: number;
  faculty: string;
  type: 'theory' | 'practical' | 'tutorial';
}

interface Faculty {
  id: string;
  name: string;
  department: string;
  maxHoursPerDay: number;
  availableDays: string[];
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: 'lecture' | 'lab' | 'tutorial';
  equipment: string[];
}

interface TimetableSlot {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  classroom: string;
  type: 'theory' | 'practical' | 'tutorial';
}

export default function CreateTimetable() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    semesterName: "",
    department: "",
    numClassrooms: "5",
    maxClassesPerDay: "6",
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    startTime: "09:00",
    endTime: "17:00",
    breakDuration: "60",
    lunchBreak: true,
  });

  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: "1",
      name: "Discrete Structure",
      code: "CS302",
      weeklyHours: 5,
      faculty: "Prof. Mukesh Tiwari ",
      type: "theory"
    },
    {
      id: "2",
      name: "Data Structure",
      code: "CS303",
      weeklyHours: 3,
      faculty: "Prof. Vivek Awasthi",
      type: "theory"
    },
    {
      id: "3",
      name: "Digital System",
      code: "CS304",
      weeklyHours: 5,
      faculty: "Prof. Rakesh Mishra",
      type: "theory"
    },
    {
      id: "4",
      name: "Energy & Environmental Engineering",
      code: "ES301",
      weeklyHours: 1,
      faculty: "Prof. Kuldeep Soni",
      type: "theory"
    },
    {
      id: "5",
      name: "Object Oriented Programing and Methodology",
      code: "CS305",
      weeklyHours: 3,
      faculty: "Prof. Pankaj Sanghai",
      type: "theory"
    },
    {
      id: "6",
      name: "C/C++ Training",
      code: "T1",
      weeklyHours: 8,
      faculty: "Mr. Rupesh Sir",
      type: "practical"
    }, {
      id: "7",
      name: "Cyber Security Training",
      code: "T2",
      weeklyHours: 2,
      faculty: "Mr. Sarvagya Rai",
      type: "practical"
    }


  ]);

  const [faculty, setFaculty] = useState<Faculty[]>([
    {
      id: "1",
      name: "Prof. Mukesh Tiwari",
      department: "Computer Science",
      maxHoursPerDay: 4,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday"]
    },
    {
      id: "2",
      name: "Prof. Vivek Awasthi",
      department: "Computer Science",
      maxHoursPerDay: 5,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    {
      id: "3",
      name: "Prof. Rakesh Mishra",
      department: "Computer Science",
      maxHoursPerDay: 5,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    {
      id: "5",
      name: "Prof. Pankaj Sanghai",
      department: "Computer Science",
      maxHoursPerDay: 5,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    {
      id: "4",
      name: "Prof. Kuldeep Soni",
      department: "Computer Science",
      maxHoursPerDay: 3,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    {
      id: "6",
      name: "Mr. Rupesh Sir",
      department: "Computer Science",
      maxHoursPerDay: 5,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    },
    {
      id: "7",
      name: "Mr. Sarvagya Rai",
      department: "Computer Science",
      maxHoursPerDay: 5,
      availableDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    }
  ]);

  const [classrooms, setClassrooms] = useState<Classroom[]>([
    {
      id: "1",
      name: "Room A-101",
      capacity: 60,
      type: "lecture",
      equipment: ["Projector", "Whiteboard", "AC"]
    },
    {
      id: "2",
      name: "Lab B-201",
      capacity: 30,
      type: "lab",
      equipment: ["Computers", "Projector", "AC"]
    }
  ]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableSlot[]>([]);
  const [showTimetable, setShowTimetable] = useState(false);

  const departments = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical"];
  const subjectTypes = ["theory", "practical", "tutorial"];
  const classroomTypes = ["lecture", "lab", "tutorial"];
  const weekDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

  const addSubject = () => {
    const newSubject: Subject = {
      id: Date.now().toString(),
      name: "",
      code: "",
      weeklyHours: 3,
      faculty: "",
      type: "theory"
    };
    setSubjects([...subjects, newSubject]);
  };

  const updateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(subjects.map(subject =>
      subject.id === id ? { ...subject, [field]: value } : subject
    ));
  };

  const removeSubject = (id: string) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  const handleWorkingDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        workingDays: [...formData.workingDays, day]
      });
    } else {
      setFormData({
        ...formData,
        workingDays: formData.workingDays.filter(d => d !== day)
      });
    }
  };

  const generateSimpleTimetable = (): TimetableSlot[] => {
    const timetable: TimetableSlot[] = [];
    const timeSlots = generateTimeSlots();

    // Initialize timetable structure
    const weeklySchedule: { [day: string]: { [time: string]: TimetableSlot | null } } = {};
    formData.workingDays.forEach(day => {
      weeklySchedule[day] = {};
      timeSlots.forEach(time => {
        weeklySchedule[day][time] = null;
      });
    });

    // Create subject sessions that need to be distributed
    const sessionsToSchedule: { subjectId: string, subject: Subject, sessionNumber: number }[] = [];
    subjects.forEach(subject => {
      for (let i = 0; i < subject.weeklyHours; i++) {
        sessionsToSchedule.push({
          subjectId: subject.id,
          subject: subject,
          sessionNumber: i + 1
        });
      }
    });

    // Shuffle sessions to avoid always placing same subjects first
    for (let i = sessionsToSchedule.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sessionsToSchedule[i], sessionsToSchedule[j]] = [sessionsToSchedule[j], sessionsToSchedule[i]];
    }

    // Track how many sessions of each subject are scheduled per day
    const subjectDayCount: { [subjectId: string]: { [day: string]: number } } = {};
    subjects.forEach(subject => {
      subjectDayCount[subject.id] = {};
      formData.workingDays.forEach(day => {
        subjectDayCount[subject.id][day] = 0;
      });
    });

    // Function to find the best slot for a session
    const findBestSlot = (session: { subjectId: string, subject: Subject }) => {
      const availableSlots: { day: string, time: string, score: number }[] = [];

      formData.workingDays.forEach(day => {
        // Check if faculty is available on this day
        const facultyMember = faculty.find(f => f.name === session.subject.faculty);
        if (!facultyMember?.availableDays.includes(day)) return;

        timeSlots.forEach(time => {
          // Skip lunch break slot (middle slot)
          const timeIndex = timeSlots.indexOf(time);
          if (timeIndex === Math.floor(timeSlots.length / 2)) return;

          // Check if slot is free
          if (weeklySchedule[day][time] !== null) return;

          // Calculate preference score (lower is better)
          let score = 0;

          // Heavily penalize if subject already has a class on this day
          if (subjectDayCount[session.subjectId][day] > 0) {
            score += 100; // Very high penalty
          }

          // Prefer spreading across different days
          const totalSessionsThisDay = Object.keys(subjectDayCount).reduce((sum, subjId) => {
            return sum + subjectDayCount[subjId][day];
          }, 0);
          score += totalSessionsThisDay * 2;

          // Slight preference for morning slots for theory, afternoon for practicals
          if (session.subject.type === 'theory' && timeIndex > timeSlots.length / 2) {
            score += 1;
          }
          if (session.subject.type === 'practical' && timeIndex < timeSlots.length / 2) {
            score += 1;
          }

          availableSlots.push({ day, time, score });
        });
      });

      // Sort by score (best first) and return the best slot
      availableSlots.sort((a, b) => a.score - b.score);
      return availableSlots.length > 0 ? availableSlots[0] : null;
    };

    // Schedule all sessions
    sessionsToSchedule.forEach(session => {
      const bestSlot = findBestSlot(session);

      if (bestSlot) {
        // Choose appropriate classroom
        const suitableClassroom = classrooms.find(room =>
          (session.subject.type === 'practical' && room.type === 'lab') ||
          (session.subject.type !== 'practical' && room.type === 'lecture')
        ) || classrooms[0];

        const timetableSlot: TimetableSlot = {
          day: bestSlot.day,
          time: bestSlot.time,
          subject: `${session.subject.name} (${session.subject.code})`,
          faculty: session.subject.faculty,
          classroom: suitableClassroom.name,
          type: session.subject.type
        };

        weeklySchedule[bestSlot.day][bestSlot.time] = timetableSlot;
        subjectDayCount[session.subjectId][bestSlot.day]++;
      }
    });

    // Convert schedule to timetable format and fill empty slots
    formData.workingDays.forEach(day => {
      timeSlots.forEach(time => {
        const timeIndex = timeSlots.indexOf(time);

        // Skip lunch break slot
        if (timeIndex === Math.floor(timeSlots.length / 2)) {
          timetable.push({
            day: day,
            time: time,
            subject: "Lunch Break",
            faculty: "",
            classroom: "",
            type: "theory"
          });
          return;
        }

        const scheduledSlot = weeklySchedule[day][time];
        if (scheduledSlot) {
          timetable.push(scheduledSlot);
        } else {
          // Free period
          timetable.push({
            day: day,
            time: time,
            subject: "Free Period",
            faculty: "",
            classroom: "",
            type: "theory"
          });
        }
      });
    });

    return timetable;
  };

  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const start = parseInt(formData.startTime.split(':')[0]);
    const end = parseInt(formData.endTime.split(':')[0]);

    for (let hour = start; hour < end; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
      slots.push(timeSlot);
    }

    return slots;
  };

  const generateTimetable = async () => {
    if (subjects.length === 0) {
      toast.error("Please add at least one subject");
      return;
    }

    if (formData.workingDays.length === 0) {
      toast.error("Please select at least one working day");
      return;
    }

    setIsGenerating(true);

    // Show loading toast and store the toast ID
    const loadingToastId = toast.loading("Generating optimized timetable...", {
      description: "This may take a few moments"
    });

    // Simulate processing time
    setTimeout(() => {
      try {
        const newTimetable = generateSimpleTimetable();
        setGeneratedTimetable(newTimetable);

        // Save to localStorage for persistence
        localStorage.setItem('generatedTimetable', JSON.stringify({
          timetable: newTimetable,
          config: formData,
          subjects: subjects,
          timestamp: new Date().toISOString()
        }));

        setIsGenerating(false);
        setShowTimetable(true);

        // Dismiss the loading toast first
        toast.dismiss(loadingToastId);

        // Then show success toast
        toast.success("Timetable generated successfully!", {
          description: "Review your generated timetable and make adjustments if needed"
        });

      } catch (error) {
        setIsGenerating(false);

        // Dismiss loading toast and show error
        toast.dismiss(loadingToastId);
        toast.error("Failed to generate timetable", {
          description: "Please check your inputs and try again"
        });
      }
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      semesterName: "",
      department: "",
      numClassrooms: "5",
      maxClassesPerDay: "6",
      workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
      startTime: "09:00",
      endTime: "17:00",
      breakDuration: "60",
      lunchBreak: true,
    });
    setSubjects([]);
    setGeneratedTimetable([]);
    setShowTimetable(false);
    toast.info("Form reset successfully");
  };

  // Enhanced saveTimetable function with both CSV and PDF options
  // Updated saveTimetable function for PDF download
  const saveTimetable = () => {
    if (generatedTimetable.length === 0) {
      toast.error("No timetable to save. Please generate one first.");
      return;
    }

    // Save to localStorage (existing functionality)
    const savedTimetables = JSON.parse(localStorage.getItem('savedTimetables') || '[]');
    const newSave = {
      id: Date.now().toString(),
      name: formData.semesterName || `Timetable ${new Date().toLocaleDateString()}`,
      timetable: generatedTimetable,
      config: formData,
      subjects: subjects,
      createdAt: new Date().toISOString()
    };

    savedTimetables.push(newSave);
    localStorage.setItem('savedTimetables', JSON.stringify(savedTimetables));

    // Generate and download PDF file
    downloadTimetableAsPDF();

    toast.success("Timetable saved and downloaded successfully!");
  };

  // Enhanced PDF download function
  const downloadTimetableAsPDF = async () => {
    // Look for the table element - we'll add the class in the JSX fix below
    const element = document.querySelector('.timetable-display') || document.querySelector('table');

    if (!element) {
      toast.error('Timetable table not found. Please generate a timetable first.');
      return;
    }

    try {
      // Show loading indicator
      const loadingToastId = toast.loading("Generating PDF...", {
        description: "Please wait while we create your timetable PDF"
      });

      // Create canvas with high quality settings
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      });

      const imgData = canvas.toDataURL('image/png', 1.0);

      // Create PDF in landscape mode for better timetable display
      const pdf = new jsPDF('l', 'mm', 'a4');

      // Get PDF dimensions
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Calculate image dimensions to fit PDF
      const margin = 10;
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - 40; // Leave space for header and footer

      const imgWidth = availableWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add header
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      const title = formData.semesterName || 'Class Timetable';
      pdf.text(title, margin, 20);

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      if (formData.department) {
        pdf.text(`Department: ${formData.department}`, margin, 30);
      }
      pdf.text(`Generated on: ${new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`, pdfWidth - 80, 30);

      // Add timetable image
      let yPosition = 35;

      if (imgHeight <= availableHeight) {
        // Fits on one page
        pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
      } else {
        // Handle multi-page PDFs
        let remainingHeight = imgHeight;
        let sourceY = 0;

        while (remainingHeight > 0) {
          const pageImageHeight = Math.min(remainingHeight, availableHeight);
          const sourceHeight = (pageImageHeight / imgHeight) * canvas.height;

          // Create a temporary canvas for this page section
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = canvas.width;
          tempCanvas.height = sourceHeight;
          const tempCtx = tempCanvas.getContext('2d');

          if (tempCtx) {
            tempCtx.drawImage(canvas, 0, sourceY, canvas.width, sourceHeight, 0, 0, canvas.width, sourceHeight);
            const tempImgData = tempCanvas.toDataURL('image/png', 1.0);
            pdf.addImage(tempImgData, 'PNG', margin, yPosition, imgWidth, pageImageHeight);
          }

          remainingHeight -= pageImageHeight;
          sourceY += sourceHeight;

          if (remainingHeight > 0) {
            pdf.addPage();
            yPosition = 10;
          }
        }
      }

      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128);
        pdf.text(`Page ${i} of ${totalPages}`, pdfWidth - 30, pdfHeight - 5);
        pdf.text('Generated by EduScheduler', margin, pdfHeight - 5);
      }

      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const sanitizedName = (formData.semesterName || 'Timetable').replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_');
      const fileName = `${sanitizedName}_${timestamp}.pdf`;

      // Save the PDF
      pdf.save(fileName);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToastId);
      toast.success("PDF downloaded successfully!", {
        description: `Saved as ${fileName}`
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF', {
        description: 'Please try again or contact support if the problem persists'
      });
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
                  <Calendar className="h-5 w-5 text-primary" />
                  Create Timetable
                </h1>
                <p className="text-sm text-muted-foreground">Generate optimized timetables with intelligent scheduling</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Form Content */}
        <div className="p-6 max-w-6xl mx-auto">
          <div className="space-y-8">
            {/* Basic Configuration */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Basic Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="semesterName">Semester/Program Name</Label>
                    <Input
                      id="semesterName"
                      placeholder="e.g., B.Tech CS - Semester 5"
                      value={formData.semesterName}
                      onChange={(e) => setFormData({ ...formData, semesterName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numClassrooms">Number of Classrooms</Label>
                    <Select value={formData.numClassrooms} onValueChange={(value) => setFormData({ ...formData, numClassrooms: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxClasses">Max Classes Per Day</Label>
                    <Select value={formData.maxClassesPerDay} onValueChange={(value) => setFormData({ ...formData, maxClassesPerDay: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="breakDuration">Lunch Break (minutes)</Label>
                    <Select value={formData.breakDuration} onValueChange={(value) => setFormData({ ...formData, breakDuration: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Working Days</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {weekDays.map((day) => (
                      <div key={day} className="flex items-center space-x-2">
                        <Checkbox
                          id={day}
                          checked={formData.workingDays.includes(day)}
                          onCheckedChange={(checked) => handleWorkingDayChange(day, checked as boolean)}
                        />
                        <Label htmlFor={day} className="text-sm font-normal capitalize">{day}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Subjects Management */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Subjects & Weekly Hours
                </CardTitle>
                <Button onClick={addSubject} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {subjects.map((subject, index) => (
                  <div key={subject.id} className="p-4 border rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Subject {index + 1}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSubject(subject.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Subject Name</Label>
                        <Input
                          placeholder="e.g., Computer Networks"
                          value={subject.name}
                          onChange={(e) => updateSubject(subject.id, 'name', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subject Code</Label>
                        <Input
                          placeholder="e.g., CS301"
                          value={subject.code}
                          onChange={(e) => updateSubject(subject.id, 'code', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Weekly Hours</Label>
                        <Select value={subject.weeklyHours.toString()} onValueChange={(value) => updateSubject(subject.id, 'weeklyHours', parseInt(value))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                              <SelectItem key={hours} value={hours.toString()}>{hours}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject Type</Label>
                        <Select value={subject.type} onValueChange={(value: 'theory' | 'practical' | 'tutorial') => updateSubject(subject.id, 'type', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {subjectTypes.map((type) => (
                              <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Assigned Faculty</Label>
                      <Select value={subject.faculty} onValueChange={(value) => updateSubject(subject.id, 'faculty', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                        <SelectContent>
                          {faculty.map((f) => (
                            <SelectItem key={f.id} value={f.name}>{f.name} - {f.department}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}

                {subjects.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No subjects added yet. Click "Add Subject" to get started.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Generated Timetable Display */}
            {showTimetable && generatedTimetable.length > 0 && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Generated Timetable
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-border timetable-display">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border border-border p-3 text-left font-medium">Time</th>
                          {formData.workingDays.map(day => (
                            <th key={day} className="border border-border p-3 text-left font-medium capitalize">
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {generateTimeSlots().map((timeSlot, timeIndex) => (
                          <tr key={timeSlot} className="hover:bg-muted/50">
                            <td className="border border-border p-2 font-medium bg-muted/30 text-xs w-24 min-w-[96px]">
                              {timeSlot}
                            </td>
                            {formData.workingDays.map(day => {
                              const slot = generatedTimetable.find(
                                s => s.day === day && s.time === timeSlot
                              );
                              return (
                                <td key={`${day}-${timeSlot}`} className="border border-border p-3 w-40 min-w-[160px]">
                                  {slot ? (
                                    <div className={`p-2 rounded text-xs min-h-[80px] flex flex-col justify-between ${slot.subject === 'Free Period'
                                      ? 'bg-gray-100 text-gray-600'
                                      : slot.type === 'practical'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-green-100 text-green-800'
                                      }`}>
                                      <div className="font-medium">{slot.subject}</div>
                                      {slot.faculty && (
                                        <div className="text-xs opacity-75">{slot.faculty}</div>
                                      )}
                                      {slot.classroom && (
                                        <div className="text-xs opacity-75">{slot.classroom}</div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="p-2 text-xs text-muted-foreground">-</div>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={generateTimetable}
                disabled={isGenerating || subjects.length === 0}
                className="flex-1 gap-2 h-12"
                size="lg"
              >
                {isGenerating ? (
                  <Settings className="h-5 w-5 animate-spin" />
                ) : (
                  <Wand2 className="h-5 w-5" />
                )}
                {isGenerating ? "Generating..." : "Generate Timetable"}
              </Button>

              <Button variant="outline" onClick={resetForm} className="gap-2 h-12" size="lg">
                <RotateCcw className="h-5 w-5" />
                Reset Form
              </Button>

              <Button
                variant="outline"
                onClick={saveTimetable}
                disabled={generatedTimetable.length === 0}
                className="gap-2 h-12"
                size="lg"
              >
                <Save className="h-5 w-5" />
                Save Timetable
              </Button>
            </div>

            {/* Quick Stats */}
            <Card className="border-0 shadow-sm bg-muted/30">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{subjects.length}</div>
                    <div className="text-sm text-muted-foreground">Subjects</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{subjects.reduce((acc, s) => acc + s.weeklyHours, 0)}</div>
                    <div className="text-sm text-muted-foreground">Total Hours</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{formData.workingDays.length}</div>
                    <div className="text-sm text-muted-foreground">Working Days</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{formData.numClassrooms}</div>
                    <div className="text-sm text-muted-foreground">Classrooms</div>
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