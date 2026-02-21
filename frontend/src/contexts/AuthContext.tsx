import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface Profile {
  id: string;
  username: string;
  must_change_password: boolean;
  is_blocked: boolean;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: Profile | null;
  session: any;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  adminRegistered: boolean | null;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [adminRegistered, setAdminRegistered] = useState<boolean | null>(true);
  const [session, setSession] = useState<any>(null);

  const apiBase = import.meta.env.VITE_API_BASE_URL ?? "";

  const mapProfile = (data: {
    Id: string;
    Username: string;
    Email: string;
    MustChangePassword: boolean;
    IsBlocked: boolean;
    CreatedAt: string;
  }): Profile => ({
    id: data.Id,
    username: data.Username,
    email: data.Email,
    must_change_password: data.MustChangePassword,
    is_blocked: data.IsBlocked,
    created_at: data.CreatedAt,
  });

  const parseErrorMessage = async (response: Response) => {
    try {
      const data = await response.json();
      if (typeof data?.Message === "string") return data.Message;
      if (typeof data?.message === "string") return data.message;
      if (typeof data?.error === "string") return data.error;
    } catch {
      // ignore parse errors
    }
    return response.statusText || "Request failed";
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { error: await parseErrorMessage(response) };
      }

      const data = await response.json();
      const profileData = mapProfile(data);
      setUser(profileData);
      setProfile(profileData);
      setIsAdmin(false);
      setSession({ user: profileData });
      return {};
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await fetch(`${apiBase}/api/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // ignore network errors on logout
    } finally {
      setUser(null);
      setProfile(null);
      setIsAdmin(false);
      setSession(null);
    }
  };

  const refreshProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiBase}/api/user/info`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        setUser(null);
        setProfile(null);
        setIsAdmin(false);
        setSession(null);
        return;
      }

      const data = await response.json();
      const profileData = mapProfile(data);
      setUser(profileData);
      setProfile(profileData);
      setIsAdmin(false);
      setSession({ user: profileData });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        loading,
        adminRegistered,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
