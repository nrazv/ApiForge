import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Zap, Database } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

interface Project {
  id: string;
  name: string;
}

interface ApiResource {
  id: string;
  name: string;
  project_id: string;
  created_at: string;
}

interface ApiField {
  id: string;
  name: string;
  data_type: "string" | "number" | "double";
  resource_id: string;
}

const fieldTypeColors: Record<string, string> = {
  string: "bg-accent text-accent-foreground",
  number: "bg-primary/10 text-primary",
  double: "bg-warning/10 text-warning",
};

export default function ApiForge() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const projectIdParam = searchParams.get("project");

  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [resources, setResources] = useState<ApiResource[]>([]);
  const [fields, setFields] = useState<Record<string, ApiField[]>>({});
  const [loading, setLoading] = useState(true);
  const [createResourceOpen, setCreateResourceOpen] = useState(false);
  const [newResourceName, setNewResourceName] = useState("");
  const [addFieldResource, setAddFieldResource] = useState<string | null>(null);
  const [newFieldName, setNewFieldName] = useState("");
  const [newFieldType, setNewFieldType] = useState<"string" | "number" | "double">("string");

  useEffect(() => {
    const mockProjects = [
      { id: "1", name: "Project Alpha" },
      { id: "2", name: "Project Beta" },
    ];
    setProjects(mockProjects);
    if (projectIdParam && mockProjects.find((p) => p.id === projectIdParam)) {
      setSelectedProjectId(projectIdParam);
    } else if (mockProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(mockProjects[0].id);
    }
    setLoading(false);
  }, [projectIdParam, selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) return;
    // Mock resources and fields
    const mockResources = [
      { id: "1", name: "Resource 1", project_id: selectedProjectId, created_at: "2026-02-18" },
      { id: "2", name: "Resource 2", project_id: selectedProjectId, created_at: "2026-02-18" },
    ];
    setResources(mockResources);
    setFields({
      "1": [
        { id: "1", name: "Field 1", resource_id: "1", data_type: "string" },
        { id: "2", name: "Field 2", resource_id: "1", data_type: "number" },
      ],
      "2": [{ id: "3", name: "Field 3", resource_id: "2", data_type: "double" }],
    });
  }, [selectedProjectId]);

  const handleCreateResource = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = Date.now().toString();
    setResources((prev) => [
      ...prev,
      { id: newId, name: newResourceName, project_id: selectedProjectId, created_at: "2026-02-18" },
    ]);
    setFields((prev) => ({ ...prev, [newId]: [] }));
    toast.success("Resource created");
    setCreateResourceOpen(false);
    setNewResourceName("");
  };

  const handleDeleteResource = (id: string) => {
    if (!confirm("Delete this resource and all its fields?")) return;
    setResources((prev) => prev.filter((r) => r.id !== id));
    setFields((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    toast.success("Resource deleted");
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFieldResource) return;
    const newId = Date.now().toString();
    setFields((prev) => ({
      ...prev,
      [addFieldResource]: [
        ...(prev[addFieldResource] || []),
        { id: newId, name: newFieldName, resource_id: addFieldResource, data_type: newFieldType },
      ],
    }));
    toast.success("Field added");
    setAddFieldResource(null);
    setNewFieldName("");
    setNewFieldType("string");
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((prev) => {
      const updated: Record<string, ApiField[]> = {};
      for (const key in prev) {
        updated[key] = prev[key].filter((f) => f.id !== fieldId);
      }
      return updated;
    });
    toast.success("Field deleted");
  };

  if (loading) {
    return <div className="p-8 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">API Forge</h1>
            <p className="text-muted-foreground">Define your API resources and fields.</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedProjectId && (
              <Dialog open={createResourceOpen} onOpenChange={setCreateResourceOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Resource
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Resource</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateResource} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Resource Name</Label>
                      <Input
                        value={newResourceName}
                        onChange={(e) => setNewResourceName(e.target.value)}
                        placeholder="users"
                        required
                        className="font-mono"
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      Create
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {!selectedProjectId ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">Select a project to manage APIs.</p>
            </CardContent>
          </Card>
        ) : resources.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Zap className="mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-muted-foreground">No resources yet. Create one to define your API.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resources.map((resource) => (
              <Card key={resource.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg font-mono">
                      <Zap className="h-4 w-4 text-primary" />/{resource.name}
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setAddFieldResource(resource.id);
                          setNewFieldName("");
                          setNewFieldType("string");
                        }}
                      >
                        <Plus className="mr-1 h-3.5 w-3.5" />
                        Add Field
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {(fields[resource.id] || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No fields defined yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {(fields[resource.id] || []).map((field) => (
                        <div
                          key={field.id}
                          className="flex items-center justify-between rounded-lg border bg-muted/30 px-4 py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <span className="font-mono text-sm font-medium">{field.name}</span>
                            <Badge variant="secondary" className={fieldTypeColors[field.data_type]}>
                              {field.data_type}
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleDeleteField(field.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Add Field Dialog */}
        <Dialog open={!!addFieldResource} onOpenChange={(open) => !open && setAddFieldResource(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Field</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddField} className="space-y-4">
              <div className="space-y-2">
                <Label>Field Name</Label>
                <Input
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="email"
                  required
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label>Data Type</Label>
                <Select
                  value={newFieldType}
                  onValueChange={(v) => setNewFieldType(v as "string" | "number" | "double")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="double">double</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Add Field
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
