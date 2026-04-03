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

interface UserSuggestion {
    id: string;
    username: string;
    email: string;
}

interface ProjectMembersDialogProps {
    open: boolean;
    projectName?: string;
    members: Member[];
    invitations: { id: string; email: string }[];
    inviteEmail: string;
    inviteSuggestions: UserSuggestion[];
    inviteLoading: boolean;
    canManageMembers: boolean;
    currentUserId?: string;
    onInviteEmailChange: (value: string) => void;
    onInvite: (event: React.FormEvent) => void;
    onSelectSuggestion: (suggestion: UserSuggestion) => void;
    onCancelInvitation: (invitation: { id: string; email: string }) => void;
    onRemoveMember: (member: Member) => void;
    onOpenChange: (open: boolean) => void;
}

export default function ProjectMembersDialog({
    open,
    projectName,
    members,
    invitations,
    inviteEmail,
    inviteSuggestions,
    inviteLoading,
    canManageMembers,
    currentUserId,
    onInviteEmailChange,
    onInvite,
    onSelectSuggestion,
    onCancelInvitation,
    onRemoveMember,
    onOpenChange,
}: ProjectMembersDialogProps) {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Project Members</DialogTitle>
                    {canManageMembers &&
                        <DialogDescription>Manage members of "{projectName}"</DialogDescription>
                    }
                </DialogHeader>
                {canManageMembers && (
                    <div className="space-y-2">
                        <form onSubmit={onInvite} className="flex gap-2">
                            <div className="relative flex-1">
                                <Input
                                    value={inviteEmail}
                                    onChange={(e) => onInviteEmailChange(e.target.value)}
                                    placeholder="user@example.com"
                                    className="font-mono"
                                    required
                                />
                                {(inviteLoading || inviteSuggestions.length > 0) && (
                                    <div className="absolute left-0 right-0 z-50 mt-1 max-h-48 overflow-auto rounded-md border bg-card p-1 shadow-lg">
                                        {inviteLoading && (
                                            <div className="px-2 py-1 text-xs text-muted-foreground">Searching...</div>
                                        )}
                                        {!inviteLoading && inviteSuggestions.map((suggestion) => (
                                            <button
                                                key={suggestion.id}
                                                type="button"
                                                className="flex w-full flex-col rounded-sm px-2 py-1 text-left text-sm hover:bg-muted"
                                                onClick={() => onSelectSuggestion(suggestion)}
                                            >
                                                <span className="font-mono">{suggestion.email}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {suggestion.username}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Button type="submit">Invite</Button>
                        </form>
                    </div>
                )}
                {canManageMembers && invitations.length > 0 && (
                    <div className="mt-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Invited
                        </p>
                        <div className="space-y-2">
                            {invitations.map((invite) => (
                                <div key={invite.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div className="flex flex-col">
                                        <span className="font-mono text-sm">{invite.email}</span>
                                        <span className="text-xs text-muted-foreground">Pending invitation</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-destructive"
                                        onClick={() => onCancelInvitation(invite)}
                                    >
                                        <UserMinus className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="space-y-2 mt-4">
                    {members.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No members yet</p>
                    ) : (
                        <>
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Members
                            </p>
                            {members.map((member) => (
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
                            ))}
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
