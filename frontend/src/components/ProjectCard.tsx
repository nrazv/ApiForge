import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trash2, Users, Zap } from "lucide-react";

interface Project {
    id: string;
    name: string;
    owner_id: string;
    created_at: string;
}

interface ProjectCardProps {
    project: Project;
    canEdit: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onMembers: () => void;
    onApis: () => void;
}

export default function ProjectCard({ project, canEdit, onEdit, onDelete, onMembers, onApis }: ProjectCardProps) {

    return (
        <Card key={project.id} className="group transition-colors hover:border-primary/30">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    {canEdit && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onEdit}
                            >
                                <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={onDelete}
                            >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                            </Button>
                        </div>
                    )}
                </div>
                <CardDescription>
                    Created {new Date(project.created_at).toLocaleDateString()}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onMembers}>
                    <Users className="mr-1.5 h-3.5 w-3.5" />
                    Members
                </Button>
                <Button variant="outline" size="sm" onClick={onApis}>
                    <Zap className="mr-1.5 h-3.5 w-3.5" />
                    APIs
                </Button>
            </CardContent>
        </Card>
    );
}
