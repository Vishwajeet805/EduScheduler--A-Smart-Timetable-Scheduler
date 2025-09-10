import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  EduState,
  Faculty,
  Subject,
  Batch,
  Classroom,
  Rules,
  Timetable,
} from "./types";

const STORAGE_KEY = "eduscheduler-data-v1";

const defaultState: EduState = {
  faculties: [],
  subjects: [],
  batches: [],
  classrooms: [],
  rules: {
    maxClassesPerDay: 6,
    classesPerSubjectPerWeek: {},
    specialSlots: [],
    considerFacultyLeaves: true,
  },
  timetables: [],
};

function loadState(): EduState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return defaultState;
}

function saveState(state: EduState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

interface EduStoreContextValue {
  state: EduState;
  upsertFaculty: (f: Faculty) => void;
  deleteFaculty: (id: string) => void;
  upsertSubject: (s: Subject) => void;
  deleteSubject: (idOrCode: string) => void;
  upsertBatch: (b: Batch) => void;
  deleteBatch: (id: string) => void;
  upsertClassroom: (c: Classroom) => void;
  deleteClassroom: (id: string) => void;
  setRules: (rules: Partial<Rules>) => void;
  generateTimetable: (title?: string) => Timetable;
}

const EduStoreContext = createContext<EduStoreContextValue | null>(null);

export function EduStoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EduState>(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const upsertFaculty = useCallback((f: Faculty) => {
    setState((prev) => {
      const exists = prev.faculties.find((x) => x.id === f.id);
      const faculties = exists
        ? prev.faculties.map((x) => (x.id === f.id ? { ...x, ...f } : x))
        : [f, ...prev.faculties];
      // Ensure subjects linked to faculties are kept consistent if needed later
      return { ...prev, faculties };
    });
  }, []);

  const deleteFaculty = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      faculties: prev.faculties.filter((f) => f.id !== id),
    }));
  }, []);

  const upsertSubject = useCallback((s: Subject) => {
    setState((prev) => {
      const exists = prev.subjects.find(
        (x) => x.id === s.id || x.code === s.code,
      );
      const normalized: Subject = {
        weeklyHours: 3,
        ...exists,
        ...s,
      } as Subject;
      const subjects = exists
        ? prev.subjects.map((x) =>
            x.id === (exists?.id || s.id) ? normalized : x,
          )
        : [normalized, ...prev.subjects];
      return { ...prev, subjects };
    });
  }, []);

  const deleteSubject = useCallback((idOrCode: string) => {
    setState((prev) => ({
      ...prev,
      subjects: prev.subjects.filter(
        (s) => s.id !== idOrCode && s.code !== idOrCode,
      ),
    }));
  }, []);

  const upsertBatch = useCallback((b: Batch) => {
    setState((prev) => {
      const exists = prev.batches.find((x) => x.id === b.id);
      const normalized: Batch = {
        facultyAssignments: {},
        ...exists,
        ...b,
        subjects: [...new Set(b.subjects || exists?.subjects || [])],
      };
      const batches = exists
        ? prev.batches.map((x) => (x.id === b.id ? normalized : x))
        : [normalized, ...prev.batches];
      return { ...prev, batches };
    });
  }, []);

  const deleteBatch = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      batches: prev.batches.filter((b) => b.id !== id),
    }));
  }, []);

  const upsertClassroom = useCallback((c: Classroom) => {
    setState((prev) => {
      const exists = prev.classrooms.find((x) => x.id === c.id);
      const classrooms = exists
        ? prev.classrooms.map((x) => (x.id === c.id ? { ...x, ...c } : x))
        : [c, ...prev.classrooms];
      return { ...prev, classrooms };
    });
  }, []);

  const deleteClassroom = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      classrooms: prev.classrooms.filter((c) => c.id !== id),
    }));
  }, []);

  const setRules = useCallback((rules: Partial<Rules>) => {
    setState((prev) => ({ ...prev, rules: { ...prev.rules, ...rules } }));
  }, []);

  // Basic greedy timetable generator (clash-avoidant)
  const generateTimetable = useCallback(
    (title = "Generated Timetable") => {
      const days: (
        | "monday"
        | "tuesday"
        | "wednesday"
        | "thursday"
        | "friday"
        | "saturday"
      )[] = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      const periodsPerDay = state.rules.maxClassesPerDay || 6;

      // Track occupied slots
      const occFaculty: Record<string, Record<string, Set<number>>> = {}; // facultyId -> day -> periods
      const occRoom: Record<string, Record<string, Set<number>>> = {}; // roomId -> day -> periods

      const entries: Timetable["entries"] = [];

      // Allocate per batch
      for (const batch of state.batches) {
        const subjects = batch.subjects;
        for (const subjCode of subjects) {
          const subj = state.subjects.find((s) => s.code === subjCode);
          const weeklyCount =
            state.rules.classesPerSubjectPerWeek?.[subjCode] ??
            subj?.weeklyHours ??
            3;
          const facultyId = batch.facultyAssignments[subjCode];
          const classroom =
            state.classrooms.find(
              (c) => c.type === (subj?.type === "lab" ? "lab" : "lecture"),
            ) || state.classrooms[0];

          let placed = 0;
          dayLoop: for (const day of days) {
            for (let p = 1; p <= periodsPerDay; p++) {
              // Clash checks
              if (facultyId) {
                const fDay = (occFaculty[facultyId] ||= {});
                const fSet = (fDay[day] ||= new Set());
                if (fSet.has(p)) continue;
              }
              if (classroom) {
                const rDay = (occRoom[classroom.id] ||= {});
                const rSet = (rDay[day] ||= new Set());
                if (rSet.has(p)) continue;
              }

              // Add entry
              entries.push({
                day,
                period: p,
                batchId: batch.id,
                subjectCode: subjCode,
                facultyId: facultyId || "",
                classroomId: classroom?.id || "",
              });
              if (facultyId) {
                (occFaculty[facultyId][day] as Set<number>).add(p);
              }
              if (classroom) {
                (occRoom[classroom.id][day] as Set<number>).add(p);
              }
              placed++;
              if (placed >= weeklyCount) break dayLoop;
            }
          }
        }
      }

      const timetable: Timetable = {
        id: String(Date.now()),
        title,
        generatedAt: new Date().toISOString(),
        periodsPerDay,
        days: days,
        entries,
      };

      setState((prev) => ({
        ...prev,
        timetables: [timetable, ...prev.timetables],
      }));
      return timetable;
    },
    [state],
  );

  const value = useMemo<EduStoreContextValue>(
    () => ({
      state,
      upsertFaculty,
      deleteFaculty,
      upsertSubject,
      deleteSubject,
      upsertBatch,
      deleteBatch,
      upsertClassroom,
      deleteClassroom,
      setRules,
      generateTimetable,
    }),
    [
      state,
      upsertFaculty,
      deleteFaculty,
      upsertSubject,
      deleteSubject,
      upsertBatch,
      deleteBatch,
      upsertClassroom,
      deleteClassroom,
      setRules,
      generateTimetable,
    ],
  );

  return (
    <EduStoreContext.Provider value={value}>
      {children}
    </EduStoreContext.Provider>
  );
}

export function useEduStore() {
  const ctx = useContext(EduStoreContext);
  if (!ctx) throw new Error("useEduStore must be used within EduStoreProvider");
  return ctx;
}
