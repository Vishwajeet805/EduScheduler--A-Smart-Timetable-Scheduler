export type DayName =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";

export interface Faculty {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  department: string;
  assignedSubjects: string[]; // subject codes/ids
  maxClassesPerWeek: number;
  avgLeavesPerMonth: number;
  weeklyLoadHours?: number;
  availability?: Partial<Record<DayName, string[]>>;
  status?: "active" | "inactive";
  joiningDate?: string;
}

export interface Subject {
  id: string; // code or uuid
  code: string;
  name: string;
  semester: string;
  type: "theory" | "lab" | "tutorial";
  weeklyHours?: number; // default 3 if not provided
  linkedFacultyIds: string[]; // Faculty.id
}

export interface Batch {
  id: string; // e.g., CS-A-2024
  name?: string; // display name optional
  year: string;
  department: string;
  semester: string;
  strength?: number;
  subjects: string[]; // Subject.code[]
  facultyAssignments: Record<string, string>; // Subject.code -> Faculty.id
}

export interface Classroom {
  id: string; // e.g., CLS001 or room code
  name: string;
  number: string;
  capacity: number;
  type: "lecture" | "lab" | "tutorial" | "seminar";
  resources?: string[];
  building?: string;
  status?: "active" | "maintenance" | "inactive";
  availability?: Partial<Record<DayName, string[]>>;
}

export interface SpecialSlotRule {
  day: string; // "Friday"
  time: string; // e.g., "3PM-5PM"
  subjectType?: "lab" | "theory" | "tutorial";
  subjectCode?: string;
}

export interface Rules {
  maxClassesPerDay: number;
  classesPerSubjectPerWeek?: Record<string, number>; // Subject.code -> count
  specialSlots?: SpecialSlotRule[];
  considerFacultyLeaves?: boolean;
}

export interface TimetableEntry {
  day: DayName;
  period: number; // 1..N
  batchId: string;
  subjectCode: string;
  facultyId: string;
  classroomId: string;
}

export interface Timetable {
  id: string;
  title: string;
  generatedAt: string;
  periodsPerDay: number;
  days: DayName[];
  entries: TimetableEntry[];
}

export interface EduState {
  faculties: Faculty[];
  subjects: Subject[];
  batches: Batch[];
  classrooms: Classroom[];
  rules: Rules;
  timetables: Timetable[];
}
