import { createContext, useContext, useState, ReactNode } from "react";

interface Profile {
  id: string;
  username: string;
  must_change_password: boolean;
  is_blocked: boolean;
  email: string;
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

  const mockAdmin = {
    id: "1",
    username: "admin",
    email: "admin@example.com",
    must_change_password: false,
    is_blocked: false,
  };

  const signIn = async (email: string, password: string) => {
    if (email === "admin@example.com" && password === "admin123") {
      setUser(mockAdmin);
      setProfile(mockAdmin);
      setIsAdmin(true);
      setSession({ user: mockAdmin });
      return {};
    }
    return { error: "Invalid credentials" };
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    setIsAdmin(false);
    setSession(null);
  };

  const refreshProfile = async () => {
    if (user) setProfile(user);
  };

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
