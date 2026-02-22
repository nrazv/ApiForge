import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";

export default function Register() {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/api/user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const message = await response.text();
                toast.error(message || "Failed to create account");
                return;
            }

            toast.success("Account created! You can now sign in.");
            navigate("/login");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-primary/20 shadow-lg">
                    <CardHeader className="text-center space-y-2">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                            <UserPlus className="h-7 w-7 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
                        <CardDescription>Sign up to create and manage projects.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="yourname"
                                    required
                                    className="font-mono"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Creating..." : "Create Account"}
                            </Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
