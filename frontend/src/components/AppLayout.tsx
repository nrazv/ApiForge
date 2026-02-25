import { ReactNode, useEffect, useState, MouseEvent } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FolderSymlink, FolderKanban, Zap, LogOut, User, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveProject {
  id: string;
  name: string;
}

const activeProjectsKey = "activeProjects";

const navItems = [
  { to: "/projects/owned", icon: FolderKanban, label: "My Projects" },
  { to: "/projects/member", icon: FolderSymlink, label: "Member Projects" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeProjects, setActiveProjects] = useState<ActiveProject[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(activeProjectsKey);
    if (!raw) {
      setActiveProjects([]);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as ActiveProject[];
      const valid = Array.isArray(parsed)
        ? parsed.filter((item) => item?.id && item?.name)
        : [];
      setActiveProjects(valid);
      return;
    } catch {
      console.error("Failed to parse active projects from localStorage");
    }

    setActiveProjects([]);
  }, [location.pathname]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCloseProject = (event: MouseEvent<HTMLButtonElement>, projectId: string) => {
    event.preventDefault();
    event.stopPropagation();
    const updated = activeProjects.filter((item) => item.id !== projectId);
    if (updated.length === 0) {
      localStorage.removeItem(activeProjectsKey);
    } else {
      localStorage.setItem(activeProjectsKey, JSON.stringify(updated));
    }
    setActiveProjects(updated);
    if (location.pathname === `/api-forge/${projectId}`) {
      navigate("/projects/owned");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="flex w-64 flex-col border-r border-border bg-sidebar">
        <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-sidebar-foreground">API Forge</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}

          {activeProjects.map((project) => (
            <NavLink
              key={project.id}
              to={`/api-forge/${project.id}`}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )
              }
            >
              <Zap className="h-4 w-4" />
              <span className="flex-1 truncate">{project.name}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={(event) => handleCloseProject(event, project.id)}
                title="Close project"
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </NavLink>
          ))}

        </nav>

        <div className="border-t border-sidebar-border p-3">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
                isActive ? "bg-sidebar-accent" : "hover:bg-sidebar-accent/50"
              )
            }
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-4 w-4" />
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium text-sidebar-foreground font-mono">
                {profile?.username || "—"}
              </p>
            </div>
          </NavLink>
          <Button
            variant="ghost"
            className="mt-1 w-full justify-start gap-3 text-muted-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
