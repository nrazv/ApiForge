import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderPlus, Pencil, Trash2, UserPlus, UserMinus, FolderKanban } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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
}

export default function Projects() {
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
  const [inviteUsername, setInviteUsername] = useState("");

  useEffect(() => {
    setProjects([
      { id: "1", name: "Project Alpha", owner_id: "1", created_at: "2026-02-18" },
      { id: "2", name: "Project Beta", owner_id: "2", created_at: "2026-02-18" },
    ]);
    setLoading(false);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setProjects((prev) => [
      ...prev,
      { id: Date.now().toString(), name: newName, owner_id: user.id, created_at: "2026-02-18" },
    ]);
    toast.success("Project created");
    setCreateOpen(false);
    setNewName("");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProject) return;
    setProjects((prev) => prev.map((p) => (p.id === editProject.id ? { ...p, name: editName } : p)));
    toast.success("Project updated");
    setEditProject(null);
    setEditName("");
  };

  const handleDelete = (project: Project) => {
    if (!confirm(`Delete project "${project.name}"?`)) return;
    setProjects((prev) => prev.filter((p) => p.id !== project.id));
    toast.success("Project deleted");
  };

  const fetchMembers = (projectId: string) => {
    setMembers([
      { id: "1", user_id: "1", username: "alice" },
      { id: "2", user_id: "2", username: "bob" },
    ]);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!membersProject) return;
    // Only allow alice and bob for mock
    if (!["alice", "bob"].includes(inviteUsername)) {
      toast.error("User not found");
      return;
    }
    if (members.some((m) => m.username === inviteUsername)) {
      toast.error("User already a member");
      return;
    }
    setMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), user_id: inviteUsername === "alice" ? "1" : "2", username: inviteUsername },
    ]);
    toast.success("User invited");
    setInviteUsername("");
  };

  const handleRemoveMember = (member: Member) => {
    if (!membersProject) return;
    setMembers((prev) => prev.filter((m) => m.id !== member.id));
    toast.success("Member removed");
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">Create and manage your projects.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <FolderPlus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Name</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    placeholder="My Project"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create
                </Button>
              </form>
            </DialogContent>
          </Dialog>
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
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="group transition-colors hover:border-primary/30">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditProject(project);
                          setEditName(project.name);
                        }}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(project)}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>Created {new Date(project.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setMembersProject(project);
                      fetchMembers(project.id);
                    }}
                  >
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                    Members
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/api-forge?project=${project.id}`)}>
                    <FolderKanban className="mr-1.5 h-3.5 w-3.5" />
                    APIs
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Project Dialog */}
        <Dialog open={!!editProject} onOpenChange={(open) => !open && setEditProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label>Project Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full">
                Save
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Members Dialog */}
        <Dialog open={!!membersProject} onOpenChange={(open) => !open && setMembersProject(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Project Members</DialogTitle>
              <DialogDescription>Manage members of "{membersProject?.name}"</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleInvite} className="flex gap-2">
              <Input
                value={inviteUsername}
                onChange={(e) => setInviteUsername(e.target.value)}
                placeholder="Enter username"
                className="font-mono"
                required
              />
              <Button type="submit">Invite</Button>
            </form>
            <div className="space-y-2 mt-4">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
              ) : (
                members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded-lg border p-3">
                    <span className="font-mono text-sm">{m.username}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleRemoveMember(m)}>
                      <UserMinus className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
