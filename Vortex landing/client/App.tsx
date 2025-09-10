import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateTimetable from "./pages/CreateTimetable";
import ManageFaculty from "./pages/ManageFaculty";
import ManageClassrooms from "./pages/ManageClassrooms";
import ReviewTimetables from "./pages/ReviewTimetables";
import NotFound from "./pages/NotFound";
import ManageSubjects from "./pages/ManageSubjects";
import Notifications from "./pages/Notifications";
import SettingsPage from "./pages/Settings";
import ManageBatches from "./pages/ManageBatches";
import Reports from "./pages/Reports";
import PlaceholderPage from "./components/PlaceholderPage";
import { Layers, BarChart3, Bell, Settings } from "lucide-react";

const queryClient = new QueryClient();

import { EduStoreProvider } from "./state/store";

const App = () => (
  <ThemeProvider defaultTheme="light" storageKey="eduscheduler-theme">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <EduStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-timetable" element={<CreateTimetable />} />
              <Route path="/manage-faculty" element={<ManageFaculty />} />
              <Route path="/manage-classrooms" element={<ManageClassrooms />} />
              <Route path="/manage-subjects" element={<ManageSubjects />} />
              <Route path="/manage-batches" element={<ManageBatches />} />
              <Route path="/review-timetables" element={<ReviewTimetables />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </EduStoreProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

const rootContainer = document.getElementById("root")!;
// Avoid calling createRoot multiple times during HMR by reusing the existing root when present
if ((rootContainer as any).__react_root) {
  (rootContainer as any).__react_root.render(<App />);
} else {
  const root = createRoot(rootContainer);
  (rootContainer as any).__react_root = root;
  root.render(<App />);
}
