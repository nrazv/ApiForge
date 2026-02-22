import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { UserMinus } from "lucide-react";

interface Member {
    id: string;
    user_id: string;
    username: string;
    email: string;
}

interface ProjectMembersDialogProps {
    open: boolean;
    projectName?: string;
    members: Member[];
    inviteEmail: string;
    canManageMembers: boolean;
    currentUserId?: string;
    onInviteEmailChange: (value: string) => void;
    onInvite: (event: React.FormEvent) => void;
    onRemoveMember: (member: Member) => void;
    onOpenChange: (open: boolean) => void;
}

export default function ProjectMembersDialog({
    open,
    projectName,
    members,
    inviteEmail,
    canManageMembers,
    currentUserId,
    onInviteEmailChange,
    onInvite,
    onRemoveMember,
    onOpenChange,
}: ProjectMembersDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Project Members</DialogTitle>
                    <DialogDescription>Manage members of "{projectName}"</DialogDescription>
                </DialogHeader>
                {canManageMembers && (
                    <form onSubmit={onInvite} className="flex gap-2">
                        <Input
                            value={inviteEmail}
                            onChange={(e) => onInviteEmailChange(e.target.value)}
                            placeholder="user@example.com"
                            className="font-mono"
                            required
                        />
                        <Button type="submit">Invite</Button>
                    </form>
                )}
                <div className="space-y-2 mt-4">
                    {members.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
                    ) : (
                        members.map((member) => (
                            <div key={member.id} className="flex items-center justify-between rounded-lg border p-3">
                                <div className="flex flex-col">
                                    <span className="font-mono text-sm">{member.username}</span>
                                    <span className="text-xs text-muted-foreground">{member.email}</span>
                                </div>
                                {canManageMembers && currentUserId !== member.user_id && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => onRemoveMember(member)}
                                        title="Remove member"
                                    >
                                        <UserMinus className="h-4 w-4 text-destructive" />
                                    </Button>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
