import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { GraduationCap, User, Lock, Sparkles } from "lucide-react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication for demo purposes
    if (username && password) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4 relative">
      {/* Theme toggle in top right */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md shadow-lg border-0 bg-card">
        <CardHeader className="text-center pb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group cursor-pointer">
                <GraduationCap className="h-8 w-8 text-primary-foreground group-hover:animate-pulse" />
              </div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            EduScheduler
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          </h1>
          <p className="text-muted-foreground text-sm">Smart Classroom & Timetable Management</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11 transition-all duration-200 focus:scale-[1.02] focus:shadow-md"
                required
              />
            </div>
            
            <Button
              type="submit"
              className="group w-full h-11 text-base font-medium hover:scale-[1.02] transition-all duration-200 hover:shadow-lg"
              disabled={!username || !password}
            >
              <span className="flex items-center gap-2">
                Sign In
                <GraduationCap className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </span>
            </Button>
          </form>
          
          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 EduScheduler. All rights reserved.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
