import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import EditProjectDialog from "@/components/EditProjectDialog";
import ProjectMembersDialog from "@/components/ProjectMembersDialog";
import CreateProjectDialog from "@/components/CreateProjectDialog";
import ProjectCard from "@/components/ProjectCard";

export type ProjectsView = "all" | "owned" | "member";

interface Project {
  id: string;
  name: string;
  owner_id: string;
  created_at: string;
}

interface Member {
  id: string;
  user_id: string;
  username: string;
  email: string;
}

export default function Projects({ view = "all" }: { view?: ProjectsView }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState("");
  const [membersProject, setMembersProject] = useState<Project | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

  const parseErrorMessage = async (response: Response) => {
    try {
      const data = await response.json();
      if (typeof data?.Message === "string") return data.Message;
      if (typeof data?.message === "string") return data.message;
      if (typeof data?.error === "string") return data.error;
    } catch {
      console.error("Failed to parse error response");
    }
    return response.statusText || "Request failed";
  };

  const mapProject = (data: {
    Id?: string;
    Name?: string;
    OwnerId?: string;
    CreatedAt?: string;
    id?: string;
    name?: string;
    ownerId?: string;
    createdAt?: string;
  }): Project => ({
    id: data.Id ?? data.id ?? "",
    name: data.Name ?? data.name ?? "",
    owner_id: data.OwnerId ?? data.ownerId ?? "",
    created_at: data.CreatedAt ?? data.createdAt ?? "",
  });

  const mapMember = (data: {
    Id?: string;
    UserId?: string;
    Username?: string;
    Email?: string;
    id?: string;
    userId?: string;
    username?: string;
    email?: string;
  }): Member => ({
    id: data.Id ?? data.id ?? "",
    user_id: data.UserId ?? data.userId ?? "",
    username: data.Username ?? data.username ?? "",
    email: data.Email ?? data.email ?? "",
  });

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiBase}/api/projects`, {
          credentials: "include",
        });

        if (!response.ok) {
          toast.error(await parseErrorMessage(response));
          setProjects([]);
          return;
        }

        const data = await response.json();
        setProjects((data ?? []).map(mapProject));
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to load projects");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const response = await fetch(`${apiBase}/api/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        toast.error(await parseErrorMessage(response));
        return;
      }

      const data = await response.json();
      const project = mapProject(data);
      setProjects((prev) => [...prev, project]);
      toast.success("Project created");
      setCreateOpen(false);
      setNewName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create project");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProject) return;
    try {
      const response = await fetch(`${apiBase}/api/projects/${editProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        toast.error(await parseErrorMessage(response));
        return;
      }

      const data = await response.json();
      const project = mapProject(data);
      setProjects((prev) => prev.map((p) => (p.id === project.id ? project : p)));
      toast.success("Project updated");
      setEditProject(null);
      setEditName("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update project");
    }
  };

  const handleDelete = async (project: Project) => {
    if (!confirm(`Delete project "${project.name}"?`)) return;
    try {
      const response = await fetch(`${apiBase}/api/projects/${project.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        toast.error(await parseErrorMessage(response));
        return;
      }

      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      toast.success("Project deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete project");
    }
  };

  const fetchMembers = async (projectId: string) => {
    try {
      const response = await fetch(`${apiBase}/api/projects/${projectId}/members`, {
        credentials: "include",
      });

      if (!response.ok) {
        toast.error(await parseErrorMessage(response));
        return;
      }

      const data = await response.json();
      setMembers((data ?? []).map(mapMember));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load members");
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!membersProject) return;
    if (user?.id !== membersProject.owner_id) {
      toast.error("Only the project owner can invite members");
      return;
    }
    try {
      const response = await fetch(`${apiBase}/api/projects/${membersProject.id}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: inviteEmail }),
      });

      if (!response.ok) {
        toast.error(await parseErrorMessage(response));
        return;
      }

      const data = await response.json();
      const member = mapMember(data);
      setMembers((prev) => [...prev, member]);
      toast.success("User invited");
      setInviteEmail("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add member");
    }
  };

  const handleRemoveMember = async (member: Member) => {
    if (!membersProject) return;
    if (user?.id !== membersProject.owner_id) {
      toast.error("Only the project owner can remove members");
      return;
    }
    if (user?.id === member.user_id) {
      toast.error("You cannot remove yourself from the project");
      return;
    }
    try {
      const response = await fetch(
        `${apiBase}/api/projects/${membersProject.id}/members/${member.user_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        toast.error(await parseErrorMessage(response));
        return;
      }

      setMembers((prev) => prev.filter((m) => m.user_id !== member.user_id));
      toast.success("Member removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to remove member");
    }
  };

  const ownedProjects = user ? projects.filter((project) => project.owner_id === user.id) : [];
  const memberProjects = user ? projects.filter((project) => project.owner_id !== user.id) : [];

  const visibleOwned = view === "member" ? [] : ownedProjects;
  const visibleMembers = view === "owned" ? [] : memberProjects;
  const canManageMembers = user?.id === membersProject?.owner_id && view !== "member";

  const openEditProject = (project: Project) => {
    setEditProject(project);
    setEditName(project.name);
  };

  const closeEditProject = () => {
    setEditProject(null);
  };

  const openMembersProject = (project: Project) => {
    setMembersProject(project);
    fetchMembers(project.id);
  };

  const closeMembersProject = () => {
    setMembersProject(null);
  };

  const openApis = (projectId: string) => {
    navigate(`/api-forge?project=${projectId}`);
  };

  const canEditProject = (project: Project) => {
    return view !== "member" && user?.id === project.owner_id;
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold">Projects</h1>
          </div>
          {view !== "member" && (
            <CreateProjectDialog
              open={createOpen}
              onOpenChange={setCreateOpen}
              name={newName}
              onNameChange={setNewName}
              onSubmit={handleCreate}
            />
          )}
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FolderKanban className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No projects yet. Create one to get started.</p>
            </CardContent>
          </Card>
        ) : view === "member" ? (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Member Projects</h2>
            {visibleMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">You are not a member of any projects yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visibleMembers.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    canEdit={canEditProject(project)}
                    onEdit={() => openEditProject(project)}
                    onDelete={() => handleDelete(project)}
                    onMembers={() => openMembersProject(project)}
                    onApis={() => openApis(project.id)}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">My Projects</h2>
            {visibleOwned.length === 0 ? (
              <p className="text-sm text-muted-foreground">You do not own any projects yet.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visibleOwned.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    canEdit={canEditProject(project)}
                    onEdit={() => openEditProject(project)}
                    onDelete={() => handleDelete(project)}
                    onMembers={() => openMembersProject(project)}
                    onApis={() => openApis(project.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <EditProjectDialog
          open={!!editProject}
          name={editName}
          onNameChange={setEditName}
          onOpenChange={(open) => !open && closeEditProject()}
          onSubmit={handleEdit}
        />

        <ProjectMembersDialog
          open={!!membersProject}
          projectName={membersProject?.name}
          members={members}
          inviteEmail={inviteEmail}
          canManageMembers={canManageMembers}
          currentUserId={user?.id}
          onInviteEmailChange={setInviteEmail}
          onInvite={handleInvite}
          onRemoveMember={handleRemoveMember}
          onOpenChange={(open) => !open && closeMembersProject()}
        />
      </motion.div>
    </div>
  );
}
