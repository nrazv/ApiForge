import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import AdminSetup from "@/pages/AdminSetup";
import Login from "@/pages/Login";
import ChangePassword from "@/pages/ChangePassword";
import Projects from "@/pages/Projects";
import ApiForge from "@/pages/ApiForge";
import UserManagement from "@/pages/UserManagement";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, profile, isAdmin, loading, adminRegistered } = useAuth();

  if (loading || adminRegistered === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!adminRegistered) {
    return <AdminSetup onComplete={() => window.location.reload()} />;
  }

  if (!user) {
    return <Login />;
  }

  if (profile?.must_change_password) {
    return <ChangePassword />;
  }

  if (profile?.is_blocked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Account Blocked</h1>
          <p className="mt-2 text-muted-foreground">Your account has been blocked. Contact an administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/api-forge" element={<ApiForge />} />
        {isAdmin && <Route path="/admin/users" element={<UserManagement />} />}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
