import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditProjectDialogProps {
    open: boolean;
    name: string;
    onNameChange: (value: string) => void;
    onOpenChange: (open: boolean) => void;
    onSubmit: (event: React.FormEvent) => void;
}

export default function EditProjectDialog({
    open,
    name,
    onNameChange,
    onOpenChange,
    onSubmit,
}: EditProjectDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Project</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Project Name</Label>
                        <Input value={name} onChange={(e) => onNameChange(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full">
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
