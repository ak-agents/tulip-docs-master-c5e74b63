import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface Doctor {
  id: string;
  fullName: string;
  credentials: string;
  title: string;
  department: string;
  email: string;
  isAdmin: boolean;
}

const ACCOUNTS: Array<{ email: string; password: string; doctor: Doctor }> = [
  {
    email: "admin@tuliphospital.co",
    password: "cardiology2025",
    doctor: {
      id: "admin",
      fullName: "Dr. Himanshu Meghnathi",
      credentials: "MD, DM (Cardiology) Gold Medalist, FSCAI",
      title: "Interventional Cardiologist",
      department: "Cardiology",
      email: "admin@tuliphospital.co",
      isAdmin: true,
    },
  },
  {
    email: "dr.himanshu@tuliphospital.co",
    password: "cardiology2025",
    doctor: {
      id: "himanshu",
      fullName: "Dr. Himanshu Meghnathi",
      credentials: "MD, DM (Cardiology) Gold Medalist, FSCAI",
      title: "Interventional Cardiologist",
      department: "Cardiology",
      email: "dr.himanshu@tuliphospital.co",
      isAdmin: false,
    },
  },
];

interface AuthCtx {
  doctor: Doctor | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "tulip_session_v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDoctor(JSON.parse(raw));
    } catch {}
  }, []);

  const login = (email: string, password: string) => {
    const match = ACCOUNTS.find(
      (a) => a.email.toLowerCase() === email.toLowerCase() && a.password === password
    );
    if (!match) return { ok: false, error: "Invalid email or password" };
    setDoctor(match.doctor);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(match.doctor));
    return { ok: true };
  };

  const logout = () => {
    setDoctor(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return <Ctx.Provider value={{ doctor, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth outside AuthProvider");
  return v;
}
