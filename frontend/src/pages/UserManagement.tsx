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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Pencil, Trash2, KeyRound, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface ManagedUser {
  id: string;
  username: string;
  email: string;
  is_blocked: boolean;
  must_change_password: boolean;
  created_at: string;
}

export default function UserManagement() {
  const { session } = useAuth();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ManagedUser | null>(null);

  // Create form
  const [newEmail, setNewEmail] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Edit form
  const [editUsername, setEditUsername] = useState("");

  // Reset form
  const [resetPassword, setResetPassword] = useState("");

  // Mock initial users
  useEffect(() => {
    setUsers([
      {
        id: "1",
        username: "alice",
        email: "alice@example.com",
        is_blocked: false,
        must_change_password: false,
        created_at: "2026-02-18",
      },
      {
        id: "2",
        username: "bob",
        email: "bob@example.com",
        is_blocked: false,
        must_change_password: false,
        created_at: "2026-02-18",
      },
    ]);
    setLoading(false);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        username: newUsername,
        email: newEmail,
        is_blocked: false,
        must_change_password: false,
        created_at: "2026-02-18",
      },
    ]);
    toast.success("User created");
    setCreateOpen(false);
    setNewEmail("");
    setNewUsername("");
    setNewPassword("");
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, username: editUsername } : u)));
    toast.success("User updated");
    setEditOpen(false);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    toast.success("Password reset");
    setResetOpen(false);
    setResetPassword("");
  };

  const handleToggleBlock = (user: ManagedUser) => {
    setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, is_blocked: !u.is_blocked } : u)));
    toast.success(user.is_blocked ? "User unblocked" : "User blocked");
  };

  const handleDelete = (user: ManagedUser) => {
    if (!confirm(`Delete user "${user.username}"? This cannot be undone.`)) return;
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.success("User deleted");
  };

  return (
    <div className="p-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Create and manage user accounts.</p>
          </div>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Create User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
                <DialogDescription>
                  The user will be required to change their password on first login.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="johndoe"
                    required
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Temporary Password</Label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Create User
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No users yet
                  </TableCell>
                </TableRow>
              ) : (
                users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-mono font-medium">{u.username}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      {u.is_blocked ? (
                        <Badge variant="destructive">Blocked</Badge>
                      ) : u.must_change_password ? (
                        <Badge variant="secondary">Must Change PW</Badge>
                      ) : (
                        <Badge className="bg-success text-success-foreground">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(u.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(u);
                            setEditUsername(u.username);
                            setEditOpen(true);
                          }}
                          title="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(u);
                            setResetPassword("");
                            setResetOpen(true);
                          }}
                          title="Reset Password"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleBlock(u)}
                          title={u.is_blocked ? "Unblock" : "Block"}
                        >
                          {u.is_blocked ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <Ban className="h-4 w-4 text-destructive" />
                          )}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(u)} title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleEdit} className="space-y-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  required
                  className="font-mono"
                />
              </div>
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={resetOpen} onOpenChange={setResetOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset Password</DialogTitle>
              <DialogDescription>
                Set a new temporary password for {selectedUser?.username}. They will be required to change it on next
                login.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
}
